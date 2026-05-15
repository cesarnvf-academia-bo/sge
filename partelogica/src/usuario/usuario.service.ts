import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioRepository.find();
    return usuarios.map(u => {
      const { clave, ...result } = u;
      return result as Usuario;
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    const { clave, ...result } = usuario;
    return result as Usuario;
  }

  async findByUsername(usuario: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { usuario } });
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Omit<Usuario, 'clave'>> {
    const existing = await this.usuarioRepository.findOne({
      where: { usuario: createUsuarioDto.usuario },
    });
    if (existing) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    const hashedClave = await bcrypt.hash(createUsuarioDto.clave, 10);
    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      clave: hashedClave,
    });
    const saved = await this.usuarioRepository.save(usuario);
    const { clave, ...result } = saved;
    return result;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Omit<Usuario, 'clave'>> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUsuarioDto.usuario && updateUsuarioDto.usuario !== usuario.usuario) {
      const existing = await this.usuarioRepository.findOne({
        where: { usuario: updateUsuarioDto.usuario },
      });
      if (existing) {
        throw new ConflictException('El nombre de usuario ya existe');
      }
    }

    if (updateUsuarioDto.clave) {
      updateUsuarioDto.clave = await bcrypt.hash(updateUsuarioDto.clave, 10);
    }

    Object.assign(usuario, updateUsuarioDto);
    const saved = await this.usuarioRepository.save(usuario);
    const { clave, ...result } = saved;
    return result;
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    await this.usuarioRepository.remove(usuario);
  }

  async validatePassword(usuario: string, clave: string): Promise<boolean> {
    const user = await this.usuarioRepository.findOne({ where: { usuario } });
    if (!user) {
      return false;
    }
    return bcrypt.compare(clave, user.clave);
  }
}
