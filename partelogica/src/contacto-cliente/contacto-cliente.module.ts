import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoCliente } from './contacto-cliente.entity';
import { ContactoClienteService } from './contacto-cliente.service';
import { ContactoClienteController } from './contacto-cliente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContactoCliente])],
  providers: [ContactoClienteService],
  controllers: [ContactoClienteController],
  exports: [ContactoClienteService],
})
export class ContactoClienteModule {}
