import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-blogger-platform'), // Укажите свой URL MongoDB
    UserAccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})


xport class AppModule {}
