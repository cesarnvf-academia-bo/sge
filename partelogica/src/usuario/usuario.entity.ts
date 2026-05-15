import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('usuario')
export class Usuario {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @ApiProperty({ description: 'Nombre de usuario' })
  @Column({ type: 'varchar', length: 100, unique: true })
  usuario: string;

  @ApiProperty({ description: 'Contrasena (almacenada encriptada)' })
  @Column({ type: 'varchar', length: 100 })
  clave: string;
}
