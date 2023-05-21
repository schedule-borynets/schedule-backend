import { TagDocument } from 'src/tag/schemas/tag.schema';
import { CreateTagDto } from 'src/tag/dto/create-tag.dto';

export class TagDto extends CreateTagDto {
  readonly id: string;

  constructor(model: TagDocument) {
    super();
    this.id = model._id.toString();
  }
}
