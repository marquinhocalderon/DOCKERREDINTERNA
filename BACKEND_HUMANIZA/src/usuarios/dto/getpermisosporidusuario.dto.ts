import { ApiProperty } from "@nestjs/swagger";

export class GetPermisosPorIdUsuarioDto {
    @ApiProperty()
    usuario: any;
    @ApiProperty()
    perfil: any;
    @ApiProperty()
    modulos: any;
    @ApiProperty()
    tablas: any;
}