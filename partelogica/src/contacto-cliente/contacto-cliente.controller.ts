import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ContactoClienteService } from './contacto-cliente.service';
import { CreateContactoClienteDto } from './dto/create-contacto-cliente.dto';
import { UpdateContactoClienteDto } from './dto/update-contacto-cliente.dto';
import { ContactoCliente } from './contacto-cliente.entity';

@ApiTags('contacto-cliente')
@Controller('api/v1/contacto-cliente')
export class ContactoClienteController {
  constructor(private readonly contactoClienteService: ContactoClienteService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los contactos de clientes',
    description:
      'Retorna un array con todos los contactos de emergencia asociados a clientes. ' +
      'Incluye la informacion relacionada del cliente.',
  })
  @ApiQuery({
    name: 'clienteId',
    required: false,
    type: 'integer',
    description: 'Filtrar contactos por ID de cliente (opcional)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de contactos obtenida exitosamente',
    type: [ContactoCliente],
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  findAll(@Query('clienteId') clienteId?: string): Promise<ContactoCliente[]> {
    if (clienteId) {
      return this.contactoClienteService.findByCliente(+clienteId);
    }
    return this.contactoClienteService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un contacto por ID',
    description:
      'Busca y retorna los datos de un contacto especifico utilizando su identificador unico. ' +
      'Incluye la informacion del cliente asociado. ' +
      'Si el contacto no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico del contacto',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Contacto encontrado exitosamente',
    type: ContactoCliente,
  })
  @ApiResponse({
    status: 404,
    description: 'Contacto no encontrado',
  })
  findOne(@Param('id') id: string): Promise<ContactoCliente> {
    return this.contactoClienteService.findOne(+id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo contacto de cliente',
    description:
      'Registra un nuevo contacto de emergencia para un cliente especifico. ' +
      'El cliente debe existir previamente. ' +
      'El campo cliente_id es obligatorio y debe ser valido.',
  })
  @ApiBody({ type: CreateContactoClienteDto, description: 'Datos del contacto a crear' })
  @ApiResponse({
    status: 201,
    description: 'Contacto creado exitosamente',
    type: ContactoCliente,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos o faltantes',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente asociado no encontrado',
  })
  create(@Body() createDto: CreateContactoClienteDto): Promise<ContactoCliente> {
    return this.contactoClienteService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un contacto existente',
    description:
      'Actualiza los datos de un contacto de cliente existente. Solo actualiza los campos proporcionados. ' +
      'Si el contacto no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico del contacto a actualizar',
    example: 1,
  })
  @ApiBody({ type: UpdateContactoClienteDto, description: 'Campos a actualizar del contacto' })
  @ApiResponse({
    status: 200,
    description: 'Contacto actualizado exitosamente',
    type: ContactoCliente,
  })
  @ApiResponse({
    status: 404,
    description: 'Contacto no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateContactoClienteDto,
  ): Promise<ContactoCliente> {
    return this.contactoClienteService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un contacto',
    description:
      'Elimina permanentemente un contacto de cliente del sistema. ' +
      'Esta accion no se puede deshacer. ' +
      'Si el contacto no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico del contacto a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Contacto eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Contacto no encontrado',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.contactoClienteService.remove(+id);
  }
}
