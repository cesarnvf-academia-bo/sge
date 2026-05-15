import { ApiProperty } from '@nestjs/swagger';

export class ClienteResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  apellido: string;

  @ApiProperty({ nullable: true })
  ci: string;

  @ApiProperty({ nullable: true })
  telefono: string;

  @ApiProperty({ nullable: true })
  email: string;

  @ApiProperty({ nullable: true })
  direccion: string;

  @ApiProperty()
  fecha_registro: Date;
}
