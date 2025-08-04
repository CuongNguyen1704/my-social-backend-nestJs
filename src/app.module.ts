import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import 'dotenv/config';
import { env } from '@usefultools/utils';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.getAsStr('DB_HOST'),
      port: env.getAsInt('DB_PORT'),
      username: env.getAsStr('DB_USERNAME'),
      password: env.getAsStr('DB_PASSWORD'),
      database: env.getAsStr('DB_DATABASE'),
      entities: [UserEntity],
      synchronize:true
      
    }),
    UserModule,AuthModule,MailModule,UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
