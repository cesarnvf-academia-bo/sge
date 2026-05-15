import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre de usuario unico', example: 'cesar' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  usuario: string;

  @ApiProperty({ description: 'Contrasena del usuario', example: '123qwe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  clave: string;
}
