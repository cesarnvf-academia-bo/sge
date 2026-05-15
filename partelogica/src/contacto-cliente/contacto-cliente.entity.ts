import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cliente } from '../cliente/cliente.entity';

@Entity('contacto_cliente')
export class ContactoCliente {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @ApiProperty({ description: 'ID del cliente asociado' })
  @Column({ name: 'cliente_id', type: 'int' })
  clienteId: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.contactos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ApiProperty({ description: 'Tipo de contacto', example: 'Emergencia' })
  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  @ApiProperty({ description: 'Nombre del contacto', example: 'Ana Perez' })
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @ApiProperty({ description: 'Telefono de contacto', example: '70000001' })
  @Column({ type: 'varchar', length: 20 })
  telefono: string;
}
