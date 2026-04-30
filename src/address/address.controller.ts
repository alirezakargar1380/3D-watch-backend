import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Response } from 'express';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto | any, @Res() res: Response) {
    const address = await this.addressService.create({
      ...createAddressDto,
      customer: { id: res.locals.user.id }
    });

    res.status(HttpStatus.ACCEPTED).send(address)
  }

  @Get()
  async findAll(@Res() res: Response) {
    const address = await this.addressService.findAll(res.locals.user.id);
    res.status(HttpStatus.ACCEPTED).send(address)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Patch('/:id/primary')
  async updatePrimary(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto, @Res() res: Response) {
    await this.addressService.updatePrimary(res.locals.user.id, +id);
    res.status(HttpStatus.ACCEPTED).send({
      message: 'done!'
    })
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
