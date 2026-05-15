import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './cliente.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cliente')
@ApiBearerAuth('JWT-auth')
/* @UseGuards(JwtAuthGuard) */
@Controller('api/v1/cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los clientes',
    description:
      'Retorna un array con todos los clientes registrados en el sistema. ' +
      'Incluye informacion basica como nombre, apellido, CI, telefono, email y direccion.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes obtenida exitosamente',
    type: [Cliente],
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token invalido o faltante',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  findAll(): Promise<Cliente[]> {
    return this.clienteService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un cliente por ID',
    description:
      'Busca y retorna los datos de un cliente especifico utilizando su identificador unico. ' +
      'Si el cliente no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico del cliente',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado exitosamente',
    type: Cliente,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token invalido o faltante',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  findOne(@Param('id') id: string): Promise<Cliente> {
    return this.clienteService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo cliente',
    description:
      'Registra un nuevo cliente en el sistema con los datos proporcionados. ' +
      'Los campos nombre y apellido son obligatorios. El campo CI debe ser unico. ' +
      'La fecha de registro se asigna automaticamente.',
  })
  @ApiBody({ type: CreateClienteDto, description: 'Datos del cliente a crear' })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado exitosamente',
    type: Cliente,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos o faltantes',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token invalido o faltante',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un cliente con ese CI',
  })
  create(@Body() createClienteDto: CreateClienteDto): Promise<Cliente> {
    return this.clienteService.create(createClienteDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un cliente existente',
    description:
      'Actualiza los datos de un cliente existente. Solo actualiza los campos proporcionados. ' +
      'Si el cliente no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico del cliente a actualizar',
    example: 1,
  })
  @ApiBody({ type: UpdateClienteDto, description: 'Campos a actualizar del cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado exitosamente',
    type: Cliente,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token invalido o faltante',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    return this.clienteService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un cliente',
    description:
      'Elimina permanentemente un cliente del sistema. ' +
      'Esta accion no se puede deshacer. ' +
      'Si el cliente no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico del cliente a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente eliminado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token invalido o faltante',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.clienteService.remove(+id);
  }
}
