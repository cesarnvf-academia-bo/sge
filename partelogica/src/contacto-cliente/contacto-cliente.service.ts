import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactoCliente } from './contacto-cliente.entity';
import { CreateContactoClienteDto } from './dto/create-contacto-cliente.dto';
import { UpdateContactoClienteDto } from './dto/update-contacto-cliente.dto';

@Injectable()
export class ContactoClienteService {
  constructor(
    @InjectRepository(ContactoCliente)
    private contactoClienteRepository: Repository<ContactoCliente>,
  ) {}

  async findAll(): Promise<ContactoCliente[]> {
    return this.contactoClienteRepository.find({ relations: ['cliente'] });
  }

  async findOne(id: number): Promise<ContactoCliente> {
    const contacto = await this.contactoClienteRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });
    if (!contacto) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
    }
    return contacto;
  }

  async findByCliente(clienteId: number): Promise<ContactoCliente[]> {
    return this.contactoClienteRepository.find({
      where: { clienteId },
      relations: ['cliente'],
    });
  }

  async create(createDto: CreateContactoClienteDto): Promise<ContactoCliente> {
    const contacto = this.contactoClienteRepository.create(createDto);
    return this.contactoClienteRepository.save(contacto);
  }

  async update(id: number, updateDto: UpdateContactoClienteDto): Promise<ContactoCliente> {
    const contacto = await this.findOne(id);
    Object.assign(contacto, updateDto);
    return this.contactoClienteRepository.save(contacto);
  }

  async remove(id: number): Promise<void> {
    const contacto = await this.findOne(id);
    await this.contactoClienteRepository.remove(contacto);
  }
}
