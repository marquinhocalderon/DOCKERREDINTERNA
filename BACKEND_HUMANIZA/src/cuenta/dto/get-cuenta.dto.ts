import { ApiProperty } from "@nestjs/swagger";

export default class GetCuentaDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    idUsuario: number;
    @ApiProperty()
    plan: string;
    @ApiProperty()
    fechaCreacion: Date;
    @ApiProperty()
    fechaExpiracion: Date;
    @ApiProperty()
    p_fecha: Date;
    @ApiProperty()
    p_minuto: number;
    @ApiProperty()
    p_dia: number;
    @ApiProperty()
    estado: string;
    @ApiProperty()
    usuario: any;
}
