import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteModule } from './cliente/cliente.module';
import { Cliente } from './cliente/cliente.entity';
import { SucursalModule } from './sucursal/sucursal.module';
import { Sucursal } from './sucursal/sucursal.entity';
import { ContactoClienteModule } from './contacto-cliente/contacto-cliente.module';
import { ContactoCliente } from './contacto-cliente/contacto-cliente.entity';
import { UsuarioModule } from './usuario/usuario.module';
import { Usuario } from './usuario/usuario.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123qwe',
      database: 'sgedb',
      entities: [Cliente, Sucursal, ContactoCliente, Usuario],
      synchronize: false,
    }),
    AuthModule,
    ClienteModule,
    SucursalModule,
    ContactoClienteModule,
    UsuarioModule,
  ],
})
export class AppModule {}
