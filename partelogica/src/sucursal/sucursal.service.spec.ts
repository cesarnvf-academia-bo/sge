import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { Sucursal } from './sucursal.entity';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

describe('SucursalService', () => {
  let service: SucursalService;
  let repository: Repository<Sucursal>;

  const mockSucursal: Sucursal = {
    id: 1,
    nombre: 'Sucursal Central',
    direccion: 'Av. Siempre Viva',
    ciudad: 'La Paz',
    telefono: '2221111',
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
        SucursalService,
        {
          provide: getRepositoryToken(Sucursal),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SucursalService>(SucursalService);
    repository = module.get<Repository<Sucursal>>(getRepositoryToken(Sucursal));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debe retornar todas las sucursales', async () => {
      const sucursales = [mockSucursal];
      mockRepository.find.mockResolvedValue(sucursales);

      const result = await service.findAll();

      expect(result).toEqual(sucursales);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('debe retornar array vacio cuando no hay sucursales', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe retornar una sucursal por id', async () => {
      mockRepository.findOne.mockResolvedValue(mockSucursal);

      const result = await service.findOne(1);

      expect(result).toEqual(mockSucursal);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debe lanzar NotFoundException si la sucursal no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('debe crear una nueva sucursal', async () => {
      const createDto: CreateSucursalDto = {
        nombre: 'Sucursal Central',
        direccion: 'Av. Siempre Viva',
        ciudad: 'La Paz',
        telefono: '2221111',
      };
      mockRepository.create.mockReturnValue(mockSucursal);
      mockRepository.save.mockResolvedValue(mockSucursal);

      const result = await service.create(createDto);

      expect(result).toEqual(mockSucursal);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockSucursal);
    });
  });

  describe('update', () => {
    it('debe actualizar una sucursal existente', async () => {
      const updateDto: UpdateSucursalDto = { nombre: 'Sucursal Modificada' };
      const updatedSucursal = { ...mockSucursal, nombre: 'Sucursal Modificada' };
      mockRepository.findOne.mockResolvedValue(mockSucursal);
      mockRepository.save.mockResolvedValue(updatedSucursal);

      const result = await service.update(1, updateDto);

      expect(result.nombre).toBe('Sucursal Modificada');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si la sucursal no existe al actualizar', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { nombre: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar una sucursal existente', async () => {
      mockRepository.findOne.mockResolvedValue(mockSucursal);
      mockRepository.remove.mockResolvedValue(mockSucursal);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockSucursal);
    });

    it('debe lanzar NotFoundException si la sucursal no existe al eliminar', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
