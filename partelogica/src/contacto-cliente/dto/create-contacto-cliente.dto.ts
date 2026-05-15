import { IsString, IsNotEmpty, MaxLength, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactoClienteDto {
  @ApiProperty({ description: 'ID del cliente asociado', example: 1 })
  @IsInt()
  @IsNotEmpty()
  clienteId: number;

  @ApiProperty({ description: 'Tipo de contacto', example: 'Emergencia' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipo: string;

  @ApiProperty({ description: 'Nombre del contacto', example: 'Ana Perez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({ description: 'Telefono del contacto', example: '70000001' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;
}
