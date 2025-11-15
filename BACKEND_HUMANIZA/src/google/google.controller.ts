import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { GoogleService } from './google.service';
import { CreateGoogleDto } from './dto/create-google.dto';
import { UpdateGoogleDto } from './dto/update-google.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Google')
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService, private readonly jwtService: JwtService, private readonly usuarioService: UsuariosService) { }

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Passport se encarga de redirigir
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    console.log('Usuario autenticado:', user);

    const usuario = await this.usuarioService.buscarPorEmail(user.email);

    if (!usuario) {
      const payloadres = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.picture,
      }

      const registoken = await this.jwtService.signAsync(payloadres, {
        secret: process.env.ACCESS_TOKEN,
        //expira en 5 minutos
        expiresIn: 60 * 5, // 5 minutos
      });

      // Si el usuario no existe, le redirigimos a un frontend para que se registre
      return res.redirect(`https://humanibot.vercel.app/auth/register?token=${registoken}`); // ACUERDATE TAMBIEN PUEDES ENVIAR LA FOTO 'picture'
    }

    const payload = {
      sub: usuario.id,
      usuario: {
        id: usuario.id,
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        perfil: usuario.perfil
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

    // Generar JWT con info básica
    const token = accessToken; // Aquí deberías generar un JWT real con la info del usuario

    // Redirigir al frontend (Angular) con el token como query param
    return res.redirect(`https://humanibot.vercel.app/auth/callback?token=${token}`);
  }

  // @Post()
  // create(@Body() createGoogleDto: CreateGoogleDto) {
  //   return this.googleService.create(createGoogleDto);
  // }

  // @Get()
  // findAll() {
  //   return this.googleService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.googleService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGoogleDto: UpdateGoogleDto) {
  //   return this.googleService.update(+id, updateGoogleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.googleService.remove(+id);
  // }
}
