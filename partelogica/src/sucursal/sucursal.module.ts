import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sucursal } from './sucursal.entity';
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sucursal])],
  providers: [SucursalService],
  controllers: [SucursalController],
  exports: [SucursalService],
})
export class SucursalModule {}
