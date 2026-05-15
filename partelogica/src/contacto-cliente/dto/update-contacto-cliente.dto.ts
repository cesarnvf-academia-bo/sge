import { PartialType } from '@nestjs/mapped-types';
import { CreateContactoClienteDto } from './create-contacto-cliente.dto';

export class UpdateContactoClienteDto extends PartialType(CreateContactoClienteDto) {}
