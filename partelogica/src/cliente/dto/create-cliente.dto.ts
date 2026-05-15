import { IsString, IsOptional, IsEmail, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'Apellido del cliente', example: 'Perez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @ApiPropertyOptional({ description: 'Carnet de identidad', example: '123456' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  ci?: string;

  @ApiPropertyOptional({ description: 'Telefono', example: '77711111' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiPropertyOptional({ description: 'Email', example: 'juan@gmail.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: 'Direccion', example: 'La Paz' })
  @IsOptional()
  @IsString()
  direccion?: string;
}
