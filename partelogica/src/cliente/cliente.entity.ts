import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ContactoCliente } from '../contacto-cliente/contacto-cliente.entity';

@Entity('cliente')
export class Cliente {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  ci: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  direccion: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_registro: Date;

  @OneToMany(() => ContactoCliente, (contacto) => contacto.cliente, { cascade: true })
  contactos: ContactoCliente[];
}
