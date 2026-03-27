import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import { CustomersService } from './../customers.service';
import { CreateCustomerDto } from './../dto/create-customer.dto';
import { UpdateCustomerDto } from './../dto/update-customer.dto';
import { Response } from 'express';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto, @Res() res: Response) { 
    res.status(HttpStatus.ACCEPTED).send(await this.customersService.create(createCustomerDto))
  }

  @Post('/register')
  async register(@Body() createCustomerDto: any, @Res() res: Response) {

    console.log(createCustomerDto)

    const userExist = await this.customersService.findOneWhere({ username: createCustomerDto.username })

    if (userExist)
      throw new BadRequestException('this username is already exist.')

    const user = await this.customersService.register(createCustomerDto);

    
    res.status(HttpStatus.ACCEPTED).send(this.customersService.login_response(user))
  }

  @Post('/auth/login')
  async authLogin(@Body() data: any, @Res() res: Response) {
    try {
      console.log(data)
      const admin = await this.customersService.login(data)
      res.status(HttpStatus.ACCEPTED).send(admin)
    } catch (e) {
      console.log(e)
      if (e?.response?.error === 'Bad Request') {
        return res.status(HttpStatus.BAD_REQUEST).send({
          message: e.response.message
        })
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "internal server error"
      })
    }
  }

  @Get("/auth/me")
  async me(@Res() res: Response) {
    try {
      let user: any = await this.customersService.findOne(+res.locals.user.id);

      res.status(HttpStatus.ACCEPTED).send({
        user
      })
    } catch (e) {
      // console.log(e)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "INTERNAL SERVER ERROR"
      })
    }
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto, @Res() res: Response) {

    if (updateCustomerDto?.phone_number) {
      const userExist = await this.customersService.findOneWhere({ phone_number: updateCustomerDto.phone_number })

      if (userExist && +id !== userExist?.id)
        throw new BadRequestException('این شماره تماس در سیستم قبلا ثبت شده است')
    }

    res.status(HttpStatus.ACCEPTED).send(await this.customersService.update(+id, updateCustomerDto))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
