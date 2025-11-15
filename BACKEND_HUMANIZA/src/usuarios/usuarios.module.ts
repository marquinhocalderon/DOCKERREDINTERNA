import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { MailModule } from '../mail/mail.module';
import { Perfile } from 'src/perfiles/entities/perfile.entity';
import { Cuenta } from 'src/cuenta/entities/cuenta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Perfile, Cuenta]), MailModule
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule { }
