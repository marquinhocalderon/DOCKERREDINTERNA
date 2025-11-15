import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({ example: 'https://example.com/avatar.jpg' })
    avatar: string;

    @ApiProperty({ example: 'Juan Pérez' })
    nombre: string;

    @ApiProperty({ example: 'juan@example.com' })
    email: string;

    @ApiProperty({ example: 'juanp' })
    usuario: string;
}

export class PerfilDto {
    @ApiProperty({ example: 'ADMIN' })
    perfil: string;
}

export class CuentaDto {
    @ApiProperty({ example: 'premium' })
    plan: string;

    @ApiProperty({ example: '2025-08-05T22:02:05.961Z' })
    fechaCreacion: string;

    @ApiProperty({ example: '2025-08-05T22:02:05.961Z' })
    fechaExpiracion: string;
}

export class InfoUsuarioDto {
    @ApiProperty({ type: UserDto })
    User: UserDto;

    @ApiProperty({ type: PerfilDto })
    Perfil: PerfilDto;

    @ApiProperty({ type: CuentaDto })
    Cuenta: CuentaDto;
}

export class GetInfoUsuarioDto {
    @ApiProperty({ type: InfoUsuarioDto })
    InfoUsuario: InfoUsuarioDto;
}
