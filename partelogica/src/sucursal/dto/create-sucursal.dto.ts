import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSucursalDto {
  @ApiProperty({ description: 'Nombre de la sucursal', example: 'Sucursal Central' })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'Dirección', example: 'Calle Principal 123' })
  @IsString()
  direccion: string;

  @ApiPropertyOptional({ description: 'Ciudad', example: 'La Paz' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ciudad?: string;

  @ApiPropertyOptional({ description: 'Teléfono', example: '2211111' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;
}