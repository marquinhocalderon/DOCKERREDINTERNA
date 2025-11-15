import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs'
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  //creamos el constructor para usar el servicio de usuario
  //creamos el constructor para usar el servicio de usuario
  constructor(private readonly usuarioService: UsuariosService,
    private readonly jwtService: JwtService) { }
  async create(createAuthDto: CreateAuthDto) {
    //buscamos el usuario por el nombre
    const usuario = await this.usuarioService.buscarParaLogin(createAuthDto.usuario);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const ahora = new Date();
    let minutosDiferencia = 0;

    if (usuario.fechaUltimoIntentoFallido) {
      minutosDiferencia = (ahora.getTime() - new Date(usuario.fechaUltimoIntentoFallido).getTime()) / (1000 * 60);
    }

    // Caso: Usuario tiene 3 intentos y no han pasado 2 minutos → sigue bloqueado
    if (usuario.intentosFallidos >= 3 && minutosDiferencia < 2) {
      throw new UnauthorizedException('Usuario bloqueado por demasiados intentos fallidos (espere 2 minutos)');
    }

    // Caso: Usuario tiene 3 intentos y ya pasaron 2 minutos → resetear a 0
    if (usuario.intentosFallidos >= 3 && minutosDiferencia >= 2) {
      usuario.intentosFallidos = 0;
      usuario.fechaUltimoIntentoFallido = null;
      await this.usuarioService.actualizarintentos(usuario.id, {
        intentosFallidos: 0,
        fechaUltimoIntentoFallido: null,
      });
    }

    const passwordValido = await bcryptjs.compare(
      createAuthDto.password,
      usuario.password
    );

    if (!passwordValido) {

      await this.usuarioService.actualizarintentos(usuario.id, {
        intentosFallidos: usuario.intentosFallidos + 1,
        fechaUltimoIntentoFallido: new Date(),
      });

      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Si login correcto, reiniciar
    await this.usuarioService.actualizarintentos(usuario.id, {
      intentosFallidos: 0,
      fechaUltimoIntentoFallido: null,
    });

    const payload = {
      sub: usuario.id,
      usuario: {
        id: usuario.id,
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN,
      expiresIn: 60 * 60, // 1 hora
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN,
      expiresIn: 60 * 60 * 24 * 30, // 30 días
    });

    return {
      token: accessToken,
      refreshToken: refreshToken,
    };
  }
}
