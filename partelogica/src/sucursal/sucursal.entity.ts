import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sucursal')
export class Sucursal {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @ApiProperty()
  @Column({ type: 'text' })
  direccion: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  ciudad: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;
}