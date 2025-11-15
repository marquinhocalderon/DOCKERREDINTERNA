import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { UpdatePasswordUsuarioDto } from './dto/updatepassword-usuario.dto';
import { MailService } from '../mail/mail.service';
import { UpdatePasswordCodeUsuarioDto } from './dto/updatepasswordcode-usuarios.dto';
import { Perfile } from 'src/perfiles/entities/perfile.entity';
import { Cuenta } from 'src/cuenta/entities/cuenta.entity';

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>, private readonly mailService: MailService, @InjectRepository(Perfile) private perfileRepository: Repository<Perfile>, @InjectRepository(Cuenta) private cuentaRepository: Repository<Cuenta>) { }
  async create(createUsuarioDto: CreateUsuarioDto, id_perfil: number) {

    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      usuario: createUsuarioDto.usuario
    });

    const emailEncontrado = await this.usuarioRepository.findOneBy({
      email: createUsuarioDto.email
    });

    //buscamos si el id_perfil existe
    const perfilEncontrado = await this.perfileRepository.findOneBy({
      id: id_perfil
    });

    if (!perfilEncontrado) {
      throw new HttpException('Perfil no encontrado', HttpStatus.NOT_FOUND);
    }

    if (emailEncontrado) {
      throw new HttpException('El email ya existe', HttpStatus.BAD_REQUEST);
    }

    if (usuarioEncontrado) {
      throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
    }

    //ahora antes de crear el usuario, vamos a enviar un correo de bienvenida al usuario
    //ahora vamos a enviar un correo de bienvenida al usuario
    const emailContent = `
                        <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HumaniBot - Bienvenido</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            color: #ffffff;
            padding: 40px 20px;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border: 1px solid #e0e0e0;
        }
        
        .header {
            background: linear-gradient(135deg, #000000 0%, #333333 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #ffffff, transparent);
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 2px;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .tagline {
            color: #cccccc;
            font-size: 14px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        
        .content {
            padding: 50px 40px;
            background: #ffffff;
            color: #333333;
        }
        
        .welcome-title {
            font-size: 28px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 30px;
            text-align: center;
            letter-spacing: 1px;
        }
        
        .message {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 20px;
            color: #444444;
        }
        
        .highlight {
            color: #000000;
            font-weight: 600;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
            margin: 30px 0;
        }
        
        .features {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        
        .feature {
            text-align: center;
            flex: 1;
            min-width: 150px;
            margin: 10px;
        }
        
        .feature-icon {
            width: 40px;
            height: 40px;
            background: #000000;
            border-radius: 50%;
            margin: 0 auto 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: bold;
        }
        
        .feature-text {
            font-size: 12px;
            color: #666666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .cta-section {
            text-align: center;
            margin: 40px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: #000000;
            color: #ffffff;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: all 0.3s ease;
            border: 2px solid #000000;
        }
        
        .cta-button:hover {
            background: #ffffff;
            color: #000000;
        }
        
        .footer {
            background: #f8f8f8;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }
        
        .footer-content {
            font-size: 12px;
            color: #888888;
            line-height: 1.6;
        }
        
        .footer-logo {
            font-weight: 700;
            color: #000000;
            letter-spacing: 1px;
        }
        
        .social-links {
            margin: 20px 0 10px;
        }
        
        .social-link {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: #000000;
            color: #ffffff;
            border-radius: 50%;
            text-decoration: none;
            margin: 0 5px;
            line-height: 30px;
            font-size: 12px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .features {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">HumaniBot</div>
            <div class="tagline">Inteligencia Artificial Humanizada</div>
        </div>
        
        <div class="content">
            <h1 class="welcome-title">¡Bienvenido al Futuro!</h1>
            
            <p class="message">
                Hola <span class="highlight">${createUsuarioDto.nombre}</span>,
            </p>
            
            <p class="message">
                Te damos la bienvenida a <strong>HumaniBot</strong>, donde la inteligencia artificial se encuentra con la experiencia humana. Has dado el primer paso hacia una nueva era de interacción digital.
            </p>
            
            <div class="divider"></div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">AI</div>
                    <div class="feature-text">Inteligencia Avanzada</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">⚡</div>
                    <div class="feature-text">Respuestas Instantáneas</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔒</div>
                    <div class="feature-text">Seguridad Total</div>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <p class="message">
                Estamos emocionados de tenerte como parte de nuestra comunidad. Prepárate para experimentar una nueva dimensión de asistencia inteligente.
            </p>
            
            
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="#" class="social-link">f</a>
                <a href="#" class="social-link">t</a>
                <a href="#" class="social-link">in</a>
            </div>
            <div class="footer-content">
                <strong class="footer-logo">HumaniBot</strong><br>
                © 2024 HumaniBot. Todos los derechos reservados.<br>
                El futuro de la inteligencia artificial humanizada.
            </div>
        </div>
    </div>
</body>
</html>

    `

    // await this.mailService.sendMail(createUsuarioDto.email, 'Bienvenido', emailContent); 
    //si hay un error en el envio del correo, el usuario no se creara

    //ahora pasamos a crear el usuario pero con el password encriptado
    const nuevoUsuario = this.usuarioRepository.create({
      avatar: createUsuarioDto.avatar,
      nombre: createUsuarioDto.nombre,
      email: createUsuarioDto.email,
      usuario: createUsuarioDto.usuario,
      password: await bcryptjs.hash(createUsuarioDto.password, 10),
      perfil: perfilEncontrado,
    });

    await this.usuarioRepository.save(nuevoUsuario);

    const nuevaCuenta = this.cuentaRepository.create({
      idUsuario: nuevoUsuario.id,
      usuario: usuarioEncontrado,
      plan: "free",
      fechaCreacion: new Date(),
      fechaExpiracion: null,
      p_fecha: null,
      p_minuto: 0,
      p_dia: 0,
    });

    //guardamos la cuenta del usuario
    await this.cuentaRepository.save(nuevaCuenta);

    return nuevoUsuario;
  }

  async findAll() {

    const usuarios = await this.usuarioRepository.find({
      relations: ['cuenta'],
      order: { id: 'DESC' }
    });

    return usuarios;
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOneBy({
      id: id
    });

    if (!usuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!usuario.estado) {
      throw new HttpException('Usuario eliminado', HttpStatus.BAD_REQUEST);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      id: id,
    });

    if (!usuarioEncontrado) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    //verificamos que el id_perfil exista
    // const perfilEncontrado = await this.perfileRepository.findOneBy({
    //   id: parseInt(updateUsuarioDto.id_perfil)
    // });

    // if (!perfilEncontrado) {
    //   throw new HttpException('Perfil no encontrado', HttpStatus.NOT_FOUND);
    // }

    //comprobar la existencia del usuario, email con el mismo nombre solo si el nombre es diferente

    if (updateUsuarioDto.email !== usuarioEncontrado.email) {
      const emailEncontrado = await this.usuarioRepository.findOneBy({
        email: updateUsuarioDto.email
      });

      if (emailEncontrado) {
        throw new HttpException('El email ya existe', HttpStatus.BAD_REQUEST);
      }
    }

    if (updateUsuarioDto.usuario !== usuarioEncontrado.usuario) {
      const usuarioEncontrado = await this.usuarioRepository.findOneBy({
        usuario: updateUsuarioDto.usuario
      });

      if (usuarioEncontrado) {
        throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
      }
    }

    await this.usuarioRepository.update(id, {
      nombre: updateUsuarioDto.nombre,
      email: updateUsuarioDto.email,
      usuario: updateUsuarioDto.usuario,
      password: usuarioEncontrado.password,
      perfil: usuarioEncontrado.perfil,
    });

    return { message: 'Usuario actualizado correctamente' };
  }

  //creamos el servicio para actualizar la contraseña
  async updatePassword(UpdatePasswordUsuarioDto: UpdatePasswordUsuarioDto) {
    //buscamos el usuario por el email
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      email: UpdatePasswordUsuarioDto.email,
      estado: true
    });

    if (!usuarioEncontrado) {
      throw new HttpException('Correo no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!usuarioEncontrado.estado) {
      throw new HttpException('Correo no encontrado', HttpStatus.BAD_REQUEST);
    }

    //generamos un codigo de  verificacion de 6 digitos
    const codigoVerificacion = Math.floor(100000 + Math.random() * 900000);

    // Establecer la expiración del código (por ejemplo, 5 minutos)
    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 5);

    //actualizamos el usuario con el codigo de verificacion y la expiracion
    await this.usuarioRepository.update(usuarioEncontrado.id, {
      resetCode: codigoVerificacion.toString(),
      resetCodeExpiration: expiracion
    });

    //ahpra vamos a mejorar la fecha y hora para enviar por correo: de esto Sat Sep 14 2024 17:36:38 a esto 14/09/2024 17:36:38, en una const expiracionformat
    const expiracionFormat = expiracion.getDate() + '/' + (expiracion.getMonth() + 1) + '/' + expiracion.getFullYear() + ' ' + expiracion.getHours() + ':' + expiracion.getMinutes() + ':' + expiracion.getSeconds();

    //ahora enviamos el dni que corresponde al usaurio y un codigo de verificacion al correo del usuario usando mail service y en el conten haremos una vusta bonita
    const emailContent = `
                        <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambio de Contraseña - HumaniBot</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            color: #ffffff;
            line-height: 1.6;
            padding: 40px 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #000000 0%, #2d2d2d 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #ffffff, transparent);
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -1px;
            color: #ffffff;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .header-title {
            font-size: 18px;
            color: #cccccc;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-weight: 300;
        }
        
        .content {
            padding: 40px 30px;
            color: #1a1a1a;
            background: #ffffff;
        }
        
        .security-title {
            font-size: 28px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 20px;
            text-align: center;
            letter-spacing: -0.5px;
        }
        
        .user-info {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid #dee2e6;
        }
        
        .user-detail {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .user-detail:last-child {
            margin-bottom: 0;
        }
        
        .label {
            color: #666666;
            font-weight: 500;
        }
        
        .value {
            color: #000000;
            font-weight: 600;
            background: #ffffff;
            padding: 4px 8px;
            border-radius: 6px;
            border: 1px solid #dee2e6;
        }
        
        .message {
            font-size: 16px;
            line-height: 1.7;
            margin-bottom: 20px;
            color: #333333;
        }
        
        .verification-code {
            background: linear-gradient(135deg, #000000 0%, #333333 100%);
            color: #ffffff;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 25px 0;
            border: 1px solid #333333;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        
        .code-label {
            font-size: 14px;
            color: #cccccc;
            margin-bottom: 10px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        
        .code-value {
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #ffffff;
            font-family: 'Courier New', monospace;
        }
        
        .expiration-info {
            background: linear-gradient(135deg, #f8f9fa, #ffffff);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid #e9ecef;
            text-align: center;
        }
        
        .timer-icon {
            width: 40px;
            height: 40px;
            background: #000000;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 18px;
        }
        
        .expiration-text {
            font-size: 14px;
            color: #666666;
            margin-bottom: 8px;
        }
        
        .expiration-time {
            font-size: 16px;
            font-weight: 600;
            color: #000000;
            font-family: 'Courier New', monospace;
        }
        
        .warning {
            background: linear-gradient(135deg, #f8f9fa, #ffffff);
            border-left: 4px solid #000000;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
            font-size: 14px;
            color: #333333;
        }
        
        .footer {
            background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
            padding: 30px;
            text-align: center;
            color: #cccccc;
            position: relative;
        }
        
        .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, #333333, transparent);
        }
        
        .footer-text {
            font-size: 12px;
            line-height: 1.5;
            color: #999999;
            letter-spacing: 0.5px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0 10px;
                border-radius: 15px;
            }
            
            .header, .content, .footer {
                padding: 25px 20px;
            }
            
            .security-title {
                font-size: 24px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .code-value {
                font-size: 28px;
                letter-spacing: 4px;
            }
            
            .user-detail {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">HumaniBot</div>
            <div class="header-title">Seguridad de Cuenta</div>
        </div>
        
        <div class="content">
            <h1 class="security-title">Cambio de Contraseña</h1>
            
            <div class="user-info">
                <div class="user-detail">
                    <span class="label">Nombre:</span>
                    <span class="value">${usuarioEncontrado.nombre}</span>
                </div>
                <div class="user-detail">
                    <span class="label">Usuario:</span>
                    <span class="value">${usuarioEncontrado.usuario}</span>
                </div>
            </div>
            
            <p class="message">
                Hemos recibido una solicitud para cambiar la contraseña de tu cuenta en HumaniBot. Por tu seguridad, necesitamos verificar tu identidad antes de proceder.
            </p>
            
            <div class="verification-code">
                <div class="code-label">Código de Verificación</div>
                <div class="code-value">${codigoVerificacion}</div>
            </div>
            
            <div class="expiration-info">
                <div class="timer-icon">⏱</div>
                <div class="expiration-text">Este código expirará el:</div>
                <div class="expiration-time">${expiracionFormat}</div>
            </div>
            
            <p class="message">
                Tienes <strong>5 minutos</strong> para utilizar este código antes de que expire por motivos de seguridad.
            </p>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong> Si no solicitaste este cambio de contraseña, por favor ignora este correo y considera cambiar tu contraseña inmediatamente desde tu cuenta.
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                © 2024 HumaniBot. Todos los derechos reservados.<br>
                Este es un mensaje automático de seguridad.
            </p>
        </div>
    </div>
</body>
</html>

`

    await this.mailService.sendMail(UpdatePasswordUsuarioDto.email, 'Cambio de contraseña', emailContent);

    return { message: 'Codigo de verificacion enviado al correo' };
  }

  //creamos el servicio para actualizar la contraseña
  async updatePasswordCode(UpdatePasswordCodeUsuarioDto: UpdatePasswordCodeUsuarioDto) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      resetCode: UpdatePasswordCodeUsuarioDto.resetCode,
      estado: true
    });

    if (!usuarioEncontrado) {
      throw new HttpException('Codigo de verificacion no valido', HttpStatus.NOT_FOUND);
    }

    if (!usuarioEncontrado.estado) {
      throw new HttpException('Codigo de verificacion no valido', HttpStatus.BAD_REQUEST);
    }

    //ahora verificamos si el codigo de verificacion ha expirado
    if (new Date() > usuarioEncontrado.resetCodeExpiration) {
      throw new HttpException('Codigo de verificacion expirado', HttpStatus.BAD_REQUEST);
    }

    //ahora pasamos a actualizar la contraseña del usuario
    await this.usuarioRepository.update(usuarioEncontrado.id, {
      password: await bcryptjs.hash(UpdatePasswordCodeUsuarioDto.password, 10),
      resetCode: null,
      resetCodeExpiration: null
    });

    return { message: 'Contraseña actualizada correctamente' };
  }

  async remove(id: number) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      id: id,
      estado: true
    });

    if (!usuarioEncontrado) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!usuarioEncontrado.estado) {
      throw new HttpException('Usuario eliminado', HttpStatus.BAD_REQUEST);
    }

    await this.usuarioRepository.update(id, { estado: false });

    return { message: 'Usuario eliminado correctamente' };
  }

  buscarParaLogin(usuario: string) {
    return this.usuarioRepository.findOne({
      where: {
        usuario: usuario,
        estado: true
      },
      select: ["id", "usuario", "nombre", "email", "password", "intentosFallidos", "fechaUltimoIntentoFallido"]
    });
  }

  buscarPorEmail(email: string) {
    return this.usuarioRepository.findOne({
      where: {
        email: email,
        estado: true
      },
      select: ["id", "usuario", "nombre", "email", "password"]
    });
  }

  async getUsiuarioinfo(id: number) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({
      id: id,
      estado: true
    });

    if (!usuarioEncontrado) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    //Ahora buscamos la cuenta del usuario
    const cuentaEncontrada = await this.cuentaRepository.findOneBy({
      usuario: { id: id },
      estado: true
    });

    if (!cuentaEncontrada) {
      throw new HttpException('Cuenta no encontrada', HttpStatus.NOT_FOUND);
    }

    const InfoUsuario = {
      User: {
        avatar: usuarioEncontrado.avatar,
        nombre: usuarioEncontrado.nombre,
        email: usuarioEncontrado.email,
        usuario: usuarioEncontrado.usuario,
      },
      Perfil: {
        perfil: usuarioEncontrado.perfil.perfil
      },
      Cuenta: {
        plan: cuentaEncontrada.plan,
        fechaCreacion: cuentaEncontrada.fechaCreacion,
        fechaExpiracion: cuentaEncontrada.fechaExpiracion,
        p_fecha: cuentaEncontrada.p_fecha,
        p_minuto: cuentaEncontrada.p_minuto,
        p_dia: cuentaEncontrada.p_dia,
      }
    }

    return InfoUsuario;
  }

  async actualizarintentos(id: number, intentos: { intentosFallidos: number, fechaUltimoIntentoFallido: Date | null }) {
    await this.usuarioRepository.update(id, intentos);
  }

}
