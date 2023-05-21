import { UserDocument } from 'src/user/schemas/user.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class UserDto extends CreateUserDto {
  readonly id: string;

  constructor(model: UserDocument) {
    super();
    this.id = model._id;
  }
}
