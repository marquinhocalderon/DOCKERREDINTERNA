import { Module } from '@nestjs/common';
import { ChathumaniceService } from './chathumanice.service';
import { ChathumaniceController } from './chathumanice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from 'src/cuenta/entities/cuenta.entity';
import { CuentaModule } from 'src/cuenta/cuenta.module';

@Module({
  imports: [CuentaModule],
  controllers: [ChathumaniceController],
  providers: [ChathumaniceService],
})
export class ChathumaniceModule {}
