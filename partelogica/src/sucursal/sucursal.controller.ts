import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { Sucursal } from './sucursal.entity';

@ApiTags('sucursal')
@Controller('api/v1/sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas las sucursales',
    description:
      'Retorna un array con todas las sucursales registradas en el sistema. ' +
      'Incluye informacion como nombre, direccion, ciudad y telefono de cada sucursal.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de sucursales obtenida exitosamente',
    type: [Sucursal],
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  findAll(): Promise<Sucursal[]> {
    return this.sucursalService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una sucursal por ID',
    description:
      'Busca y retorna los datos de una sucursal especifica utilizando su identificador unico. ' +
      'Si la sucursal no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico de la sucursal',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Sucursal encontrada exitosamente',
    type: Sucursal,
  })
  @ApiResponse({
    status: 404,
    description: 'Sucursal no encontrada',
  })
  findOne(@Param('id') id: string): Promise<Sucursal> {
    return this.sucursalService.findOne(+id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva sucursal',
    description:
      'Registra una nueva sucursal en el sistema con los datos proporcionados. ' +
      'Los campos nombre y direccion son obligatorios. ' +
      'Ciudad y telefono son campos opcionales.',
  })
  @ApiBody({ type: CreateSucursalDto, description: 'Datos de la sucursal a crear' })
  @ApiResponse({
    status: 201,
    description: 'Sucursal creada exitosamente',
    type: Sucursal,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos o faltantes',
  })
  create(@Body() createSucursalDto: CreateSucursalDto): Promise<Sucursal> {
    return this.sucursalService.create(createSucursalDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una sucursal existente',
    description:
      'Actualiza los datos de una sucursal existente. Solo actualiza los campos proporcionados. ' +
      'Si la sucursal no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico de la sucursal a actualizar',
    example: 1,
  })
  @ApiBody({ type: UpdateSucursalDto, description: 'Campos a actualizar de la sucursal' })
  @ApiResponse({
    status: 200,
    description: 'Sucursal actualizada exitosamente',
    type: Sucursal,
  })
  @ApiResponse({
    status: 404,
    description: 'Sucursal no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  update(
    @Param('id') id: string,
    @Body() updateSucursalDto: UpdateSucursalDto,
  ): Promise<Sucursal> {
    return this.sucursalService.update(+id, updateSucursalDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una sucursal',
    description:
      'Elimina permanentemente una sucursal del sistema. ' +
      'Esta accion no se puede deshacer. ' +
      'Si la sucursal no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico de la sucursal a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Sucursal eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Sucursal no encontrada',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.sucursalService.remove(+id);
  }
}
