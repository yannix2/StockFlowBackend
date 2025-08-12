import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/user.entity';

@Controller('setup')
export class SetupController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin')
  async createAdmin(
    @Body() dto: CreateUserDto,
    @Headers('x-setup-token') token: string,
  ) {
    if (token !== process.env.SETUP_TOKEN) {
      throw new UnauthorizedException('Invalid setup token');
    }

    return this.usersService.create({
      ...dto,
      role: UserRole.ADMIN, 
    });
  }
}
