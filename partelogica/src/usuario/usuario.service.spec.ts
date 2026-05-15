import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<Usuario>;

  const hashedPassword = '$2b$10$hashedpassword';
  const mockUsuario: Usuario = {
    id: 1,
    usuario: 'cesar',
    clave: hashedPassword,
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debe retornar todos los usuarios sin clave', async () => {
      const usuarios = [mockUsuario];
      mockRepository.find.mockResolvedValue(usuarios);

      const result = await service.findAll();

      expect(result).toEqual([{ id: 1, usuario: 'cesar' }]);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('debe retornar array vacio cuando no hay usuarios', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un usuario por id sin clave', async () => {
      mockRepository.findOne.mockResolvedValue(mockUsuario);

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1, usuario: 'cesar' });
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUsername', () => {
    it('debe retornar un usuario por nombre de usuario', async () => {
      mockRepository.findOne.mockResolvedValue(mockUsuario);

      const result = await service.findByUsername('cesar');

      expect(result).toEqual(mockUsuario);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { usuario: 'cesar' } });
    });

    it('debe retornar null si no existe el usuario', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByUsername('inexistente');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('debe crear un nuevo usuario con contrasena encriptada', async () => {
      const createDto: CreateUsuarioDto = { usuario: 'cesar', clave: '123qwe' };
      const createdUsuario = { ...mockUsuario, clave: hashedPassword };
      
      mockRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(createdUsuario);
      mockRepository.save.mockResolvedValue(createdUsuario);

      const result = await service.create(createDto);

      expect(result).toEqual({ id: 1, usuario: 'cesar' });
      expect(bcrypt.hash).toHaveBeenCalledWith('123qwe', 10);
    });

    it('debe lanzar ConflictException si el usuario ya existe', async () => {
      const createDto: CreateUsuarioDto = { usuario: 'cesar', clave: '123qwe' };
      mockRepository.findOne.mockResolvedValue(mockUsuario);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('debe actualizar un usuario existente', async () => {
      const updateDto: UpdateUsuarioDto = { usuario: 'cesar_updated' };
      const updatedUsuario = { ...mockUsuario, usuario: 'cesar_updated' };
      
      mockRepository.findOne
        .mockResolvedValueOnce(mockUsuario)
        .mockResolvedValueOnce(null);
      mockRepository.save.mockResolvedValue(updatedUsuario);

      const result = await service.update(1, updateDto);

      expect(result.usuario).toBe('cesar_updated');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el usuario no existe al actualizar', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { usuario: 'test' })).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar ConflictException si el nuevo nombre de usuario ya existe', async () => {
      const existingUser = { id: 2, usuario: 'nilton', clave: hashedPassword };
      mockRepository.findOne
        .mockResolvedValueOnce(mockUsuario)
        .mockResolvedValueOnce(existingUser);

      await expect(service.update(1, { usuario: 'nilton' })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('debe eliminar un usuario existente', async () => {
      mockRepository.findOne.mockResolvedValue(mockUsuario);
      mockRepository.remove.mockResolvedValue(mockUsuario);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockUsuario);
    });

    it('debe lanzar NotFoundException si el usuario no existe al eliminar', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validatePassword', () => {
    it('debe retornar true si la contrasena es correcta', async () => {
      mockRepository.findOne.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validatePassword('cesar', '123qwe');

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('123qwe', hashedPassword);
    });

    it('debe retornar false si el usuario no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.validatePassword('inexistente', '123qwe');

      expect(result).toBe(false);
    });

    it('debe retornar false si la contrasena es incorrecta', async () => {
      mockRepository.findOne.mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validatePassword('cesar', 'wrongpassword');

      expect(result).toBe(false);
    });
  });
});
