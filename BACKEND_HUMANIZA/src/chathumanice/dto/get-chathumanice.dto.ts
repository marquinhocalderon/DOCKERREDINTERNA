import { ApiProperty } from "@nestjs/swagger";

export class GetChathumaniceDto {
    @ApiProperty()
    parrafo_rescrito: string;
}