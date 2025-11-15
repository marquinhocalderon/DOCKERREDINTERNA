import { ApiProperty } from "@nestjs/swagger";

export class GetUsuarioDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    avatar: string;
    @ApiProperty()
    nombre: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    usuario: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    perfil: any;
    @ApiProperty()
    estado: boolean;
}