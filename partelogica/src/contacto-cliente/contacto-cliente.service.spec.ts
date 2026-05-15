import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ContactoClienteService } from './contacto-cliente.service';
import { ContactoCliente } from './contacto-cliente.entity';
import { CreateContactoClienteDto } from './dto/create-contacto-cliente.dto';
import { UpdateContactoClienteDto } from './dto/update-contacto-cliente.dto';

describe('ContactoClienteService', () => {
  let service: ContactoClienteService;
  let repository: Repository<ContactoCliente>;

  const mockCliente = { id: 1, nombre: 'Juan', apellido: 'Perez' };

  const mockContacto: ContactoCliente = {
    id: 1,
    clienteId: 1,
    cliente: mockCliente as any,
    tipo: 'Emergencia',
    nombre: 'Ana Perez',
    telefono: '70000001',
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
        ContactoClienteService,
        {
          provide: getRepositoryToken(ContactoCliente),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContactoClienteService>(ContactoClienteService);
    repository = module.get<Repository<ContactoCliente>>(getRepositoryToken(ContactoCliente));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debe retornar todos los contactos con relacion de cliente', async () => {
      const contactos = [mockContacto];
      mockRepository.find.mockResolvedValue(contactos);

      const result = await service.findAll();

      expect(result).toEqual(contactos);
      expect(mockRepository.find).toHaveBeenCalledWith({ relations: ['cliente'] });
    });

    it('debe retornar array vacio cuando no hay contactos', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe retornar un contacto por id con relacion', async () => {
      mockRepository.findOne.mockResolvedValue(mockContacto);

      const result = await service.findOne(1);

      expect(result).toEqual(mockContacto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['cliente'],
      });
    });

    it('debe lanzar NotFoundException si el contacto no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCliente', () => {
    it('debe retornar contactos filtrados por clienteId', async () => {
      const contactos = [mockContacto];
      mockRepository.find.mockResolvedValue(contactos);

      const result = await service.findByCliente(1);

      expect(result).toEqual(contactos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { clienteId: 1 },
        relations: ['cliente'],
      });
    });
  });

  describe('create', () => {
    it('debe crear un nuevo contacto', async () => {
      const createDto: CreateContactoClienteDto = {
        clienteId: 1,
        tipo: 'Emergencia',
        nombre: 'Ana Perez',
        telefono: '70000001',
      };
      mockRepository.create.mockReturnValue(mockContacto);
      mockRepository.save.mockResolvedValue(mockContacto);

      const result = await service.create(createDto);

      expect(result).toEqual(mockContacto);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockContacto);
    });
  });

  describe('update', () => {
    it('debe actualizar un contacto existente', async () => {
      const updateDto: UpdateContactoClienteDto = { nombre: 'Ana Maria Perez' };
      const updatedContacto = { ...mockContacto, nombre: 'Ana Maria Perez' };
      mockRepository.findOne.mockResolvedValue(mockContacto);
      mockRepository.save.mockResolvedValue(updatedContacto);

      const result = await service.update(1, updateDto);

      expect(result.nombre).toBe('Ana Maria Perez');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el contacto no existe al actualizar', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { nombre: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar un contacto existente', async () => {
      mockRepository.findOne.mockResolvedValue(mockContacto);
      mockRepository.remove.mockResolvedValue(mockContacto);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockContacto);
    });

    it('debe lanzar NotFoundException si el contacto no existe al eliminar', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
