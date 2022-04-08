import { ApiExtraModels, PartialType } from '@nestjs/swagger';
import { CreateProviderDto } from './create-provider.dto';

@ApiExtraModels(CreateProviderDto)
export class UpdateProviderDto extends PartialType(CreateProviderDto) {}
