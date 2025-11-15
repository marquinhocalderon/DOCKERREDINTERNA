import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector, private readonly usuarioService: UsuariosService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {  // Declaramos la función como async
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si la ruta no tiene roles definidos, permite el acceso
    }

    const { user } = context.switchToHttp().getRequest();

    const usuario = await this.usuarioService.findOne(user.sub); // Buscamos el usuario por el nombre

    console.log('Usuario', usuario);

    const [requiredPerfil] = requiredRoles;

    const tienePermiso = usuario.perfil.perfil === requiredPerfil;

    if (!tienePermiso) {
      throw new ForbiddenException('No tienes permiso para acceder a esta ruta');
    }

    return true;
  }
}
