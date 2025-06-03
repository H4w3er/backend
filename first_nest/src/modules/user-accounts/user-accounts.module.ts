import { Module } from '@nestjs/common';
import { UsersController } from './api/user-controller';
import { UserService } from './application/user-service';

@Module({
  controllers: [UsersController],
  providers: [UserService],
})
export class UserAccountsModule {}
