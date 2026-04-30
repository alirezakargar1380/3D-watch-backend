import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) { }

  create(createAddressDto: CreateAddressDto) {
    return this.addressRepository.save(createAddressDto);
  }

  findAll(id: number) {
    return this.addressRepository.find({
      where: {
        customer: { id }
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  async updatePrimary(user_id: number, address_id: number) {
    let address = await this.addressRepository.find({ where: { customer: { id: user_id } } });
    address = address.map((add) => {
      return {
        ...add,
        ...(address_id === add.id ? {
          primary: true
        } : {
          primary: false
        })
      }
    })

    await this.addressRepository.save(address)
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
