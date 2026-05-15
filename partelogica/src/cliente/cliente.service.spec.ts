import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

describe('ClienteService', () => {
  let service: ClienteService;
  let repository: Repository<Cliente>;

  const mockCliente: Cliente = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Perez',
    ci: '123456',
    telefono: '77711111',
    email: 'juan@gmail.com',
    direccion: 'La Paz',
    fecha_registro: new Date(),
    contactos: [],
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
        ClienteService,
        {
          provide: getRepositoryToken(Cliente),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
    repository = module.get<Repository<Cliente>>(getRepositoryToken(Cliente));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debe retornar todos los clientes', async () => {
      const clientes = [mockCliente];
      mockRepository.find.mockResolvedValue(clientes);

      const result = await service.findAll();

      expect(result).toEqual(clientes);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('debe retornar array vacio cuando no hay clientes', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un cliente por id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCliente);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCliente);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debe lanzar NotFoundException si el cliente no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('debe crear un nuevo cliente', async () => {
      const createDto: CreateClienteDto = {
        nombre: 'Juan',
        apellido: 'Perez',
        ci: '123456',
        telefono: '77711111',
        email: 'juan@gmail.com',
        direccion: 'La Paz',
      };
      mockRepository.create.mockReturnValue(mockCliente);
      mockRepository.save.mockResolvedValue(mockCliente);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCliente);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCliente);
    });
  });

  describe('update', () => {
    it('debe actualizar un cliente existente', async () => {
      const updateDto: UpdateClienteDto = { nombre: 'Juan Carlos' };
      const updatedCliente = { ...mockCliente, nombre: 'Juan Carlos' };
      mockRepository.findOne.mockResolvedValue(mockCliente);
      mockRepository.save.mockResolvedValue(updatedCliente);

      const result = await service.update(1, updateDto);

      expect(result.nombre).toBe('Juan Carlos');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el cliente no existe al actualizar', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { nombre: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar un cliente existente', async () => {
      mockRepository.findOne.mockResolvedValue(mockCliente);
      mockRepository.remove.mockResolvedValue(mockCliente);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockCliente);
    });

    it('debe lanzar NotFoundException si el cliente no existe al eliminar', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
