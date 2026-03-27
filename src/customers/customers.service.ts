import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customers } from './entities/customer.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customers) private customersRepository: Repository<Customers>,
    private jwtService: JwtService,
  ) { }

  async create(createCustomerDto: CreateCustomerDto) {

    if (createCustomerDto.password) {
      const saltRounds: number = 10;
      createCustomerDto.password = await bcrypt
        .genSalt(saltRounds)
        .then((salt: string) => {
          return bcrypt.hash(createCustomerDto.password || '', salt)
        }).then((hash: string) => {
          return hash
        })
    } else {
      delete createCustomerDto.password;
    }

    return this.customersRepository.save(createCustomerDto);
  }

  async register(createCustomerDto: CreateCustomerDto) {

    const saltRounds: number = 10;
    createCustomerDto.password = await bcrypt.genSalt(saltRounds).then((salt: string) => {
      return bcrypt.hash(createCustomerDto.password || '', salt)
    }).then((hash: string) => {
      return hash
    })

    return this.customersRepository.save(createCustomerDto);
  }

  async login(data: any) {
    let customer: Customers | any = await this.customersRepository.findOne({
      where: {
        username: data.username,
      }
    })

    if (!customer)
      throw new BadRequestException("username or password is incorrect")

    const passwordCheck: boolean = await bcrypt
      .compare(data.password, customer.password)
      .then((res) => {
        return res
      })

    if (!passwordCheck) {
      throw new BadRequestException("username or password is incorrect")
    }

    return this.login_response(customer);
  }

  login_response(customer: Customers) {
    let accessToken = this.jwtService.sign({
      id: customer.id,
    })

    return {
      user: customer,
      accessToken,
    }
  }

  findAll() {
    return this.customersRepository.find();
  }

  findOneWhere(where: any) {
    return this.customersRepository.findOne({ where });
  }

  findOne(id: number) {
    return this.customersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    if (updateCustomerDto?.password) {
      console.log('update user password')
      const saltRounds: number = 10;
      updateCustomerDto.password = await bcrypt.genSalt(saltRounds).then((salt: string) => {
        return bcrypt.hash(updateCustomerDto.password || '', salt)
      }).then((hash: string) => {
        return hash
      })
    } else {
      delete updateCustomerDto.password;
    }

    return this.customersRepository.update({ id }, updateCustomerDto);
  }

  remove(id: number) {
    return this.customersRepository.softDelete({ id });
  }
}
