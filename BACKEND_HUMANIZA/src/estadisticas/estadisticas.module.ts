import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { Type } from 'class-transformer';
import { Estadistica } from './entities/estadistica.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estadistica, Usuario])],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
  exports: [EstadisticasService]
})
export class EstadisticasModule { }
