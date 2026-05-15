import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesion',
    description:
      'Autentica un usuario con nombre de usuario y contrasena. ' +
      'Retorna un token JWT que debe ser usado en el header Authorization de las demas peticiones. ' +
      'El token tiene una validez de 24 horas.',
  })
  @ApiBody({ type: LoginDto, description: 'Credenciales de acceso' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, retorna token JWT',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales invalidas',
  })
  login(@Body() loginDto: LoginDto) {    
    return this.authService.login(loginDto);
  }
}
