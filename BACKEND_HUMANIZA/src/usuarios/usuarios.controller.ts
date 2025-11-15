import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUsuarioDto } from './dto/get-usuario.dto';
import { UpdatePasswordUsuarioDto } from './dto/updatepassword-usuario.dto';
import { UpdatePasswordCodeUsuarioDto } from './dto/updatepasswordcode-usuarios.dto';
import { GetPermisosPorIdUsuarioDto } from './dto/getpermisosporidusuario.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { GetInfoUsuarioDto } from './dto/get-infousuario.dto';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @ApiBody({ type: CreateUsuarioDto })
  @Post('/regis/admin')
  @UseGuards(JwtAuthGuard)
  //@Roles('usuarios', 'post')
  createadmin(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto, 1);
  }

  @ApiBody({ type: CreateUsuarioDto })
  @Post('/regis/cliente')
  @UseGuards(JwtAuthGuard)
  //@Roles('usuarios', 'post')
  createcliente(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto, 2);
  }

  @ApiBody({ type: [GetUsuarioDto] })
  @Get()
  @UseGuards(JwtAuthGuard)
  //@Roles('usuarios', 'get')
  findAll() {
    return this.usuariosService.findAll();
  }

  @ApiBody({ type: GetUsuarioDto })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  //@Roles('usuarios', 'get')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @ApiBody({ type: UpdateUsuarioDto })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  //@Roles('usuarios', 'put')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @ApiBody({ type: UpdatePasswordUsuarioDto })
  @Post('/solicitarresetpassword')
  updatePassword(@Body() updatePasswordUsuarioDto: UpdatePasswordUsuarioDto) {
    return this.usuariosService.updatePassword(updatePasswordUsuarioDto);
  }

  @ApiBody({ type: UpdatePasswordCodeUsuarioDto })
  @Patch('/actualizar/password')
  updatePasswordCode(@Body() updatePasswordCodeUsuarioDto: UpdatePasswordCodeUsuarioDto) {
    console.log('updatePasswordCodeUsuarioDto', updatePasswordCodeUsuarioDto);
    return this.usuariosService.updatePasswordCode(updatePasswordCodeUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('usuarios', 'delete')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
  @ApiBody({ type: GetInfoUsuarioDto })
  @Get('/info/:id')
  @UseGuards(JwtAuthGuard)
  getUsuarioInfo(@Param('id') id: string) {
    return this.usuariosService.getUsiuarioinfo(+id);
  }

}
