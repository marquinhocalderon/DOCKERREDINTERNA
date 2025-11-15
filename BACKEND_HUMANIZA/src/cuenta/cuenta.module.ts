import { Module } from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { CuentaController } from './cuenta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from './entities/cuenta.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { EstadisticasModule } from 'src/estadisticas/estadisticas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cuenta, Usuario]), EstadisticasModule],
  controllers: [CuentaController],
  providers: [CuentaService],
  exports: [CuentaService]
})
export class CuentaModule { }
