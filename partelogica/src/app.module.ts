import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get('DATABASE_USER', 'postgres'),
        password: config.get('DATABASE_PASSWORD', '123qwe'),
        database: config.get('DATABASE_NAME', 'sgedb'),
        entities: [Cliente, Sucursal, ContactoCliente, Usuario],
        synchronize: false,
      }),
    }),
    AuthModule,
    ClienteModule,
    SucursalModule,
    ContactoClienteModule,
    UsuarioModule,
  ],
})
export class AppModule {}
