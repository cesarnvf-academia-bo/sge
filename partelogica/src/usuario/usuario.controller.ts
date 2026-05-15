import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './usuario.entity';

@ApiTags('usuario')
@Controller('api/v1/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los usuarios',
    description:
      'Retorna un array con todos los usuarios registrados en el sistema. ' +
      'La contrasena no es incluida en la respuesta por seguridad.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    type: [Usuario],
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un usuario por ID',
    description:
      'Busca y retorna los datos de un usuario especifico. ' +
      'La contrasena no es incluida en la respuesta. ' +
      'Si el usuario no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico del usuario',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuarioService.findOne(+id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description:
      'Registra un nuevo usuario en el sistema. ' +
      'El nombre de usuario debe ser unico. ' +
      'La contrasena se almacena encriptada automaticamente.',
  })
  @ApiBody({ type: CreateUsuarioDto, description: 'Datos del usuario a crear' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: Usuario,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos o faltantes',
  })
  @ApiResponse({
    status: 409,
    description: 'El nombre de usuario ya existe',
  })
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Omit<Usuario, 'clave'>> {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un usuario existente',
    description:
      'Actualiza los datos de un usuario existente. Solo actualiza los campos proporcionados. ' +
      'Si se actualiza la contrasena, se reencripta automaticamente. ' +
      'Si el usuario no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico del usuario a actualizar',
    example: 1,
  })
  @ApiBody({ type: UpdateUsuarioDto, description: 'Campos a actualizar del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 409,
    description: 'El nombre de usuario ya existe',
  })
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Omit<Usuario, 'clave'>> {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un usuario',
    description:
      'Elimina permanentemente un usuario del sistema. ' +
      'Esta accion no se puede deshacer. ' +
      'Si el usuario no existe, retorna un error 404.',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Identificador unico del usuario a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.usuarioService.remove(+id);
  }
}
