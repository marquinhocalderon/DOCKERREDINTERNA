import { ApiProperty } from "@nestjs/swagger";

export class GetEstadisticaDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    fechadia: Date;

    @ApiProperty()
    totalpeticiones: number;

    @ApiProperty()
    plan: string;

    @ApiProperty()
    usuario: any;
}
