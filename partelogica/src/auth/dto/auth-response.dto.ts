import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'Token de acceso JWT' })
  access_token: string;

  @ApiProperty({ description: 'Tipo de token' })
  token_type: string;

  @ApiProperty({ description: 'Tiempo de expiracion en segundos' })
  expires_in: number;
}
