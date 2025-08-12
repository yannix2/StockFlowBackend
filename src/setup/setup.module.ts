import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [SetupController],
})
export class SetupModule {}
