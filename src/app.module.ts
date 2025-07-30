import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/user/user.entity';
import { UserModul } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username:'postgres',
      password:'123456',
      database:'mysocail_backend_nestjs',
      entities: [UserEntity],
      synchronize:true
      
    }),
    UserModul,AuthModule,MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
