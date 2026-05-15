import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const isValid = await this.usuarioService.validatePassword(
      loginDto.usuario,
      loginDto.clave,
    );

    if (!isValid) {
      return null;
    }

    const usuario = await this.usuarioService.findByUsername(loginDto.usuario);
    
    if (!usuario) {
      return null;
    }

    const payload = {
      sub: usuario.id,
      username: usuario.usuario,
    };

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      expires_in: 86400,
    };
  }

  async validateUser(payload: any) {
    return this.usuarioService.findByUsername(payload.username);
  }
}
