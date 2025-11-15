import { PartialType } from '@nestjs/swagger';
import { CreateChathumaniceDto } from './create-chathumanice.dto';

export class UpdateChathumaniceDto extends PartialType(CreateChathumaniceDto) {}
