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
import { PostModule } from './modules/post/post.module';
import { PostEntity } from './modules/post/post.entity';
import { ImageEntity } from './modules/upload/image.entity';

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
      entities: [UserEntity,PostEntity,ImageEntity],
      synchronize:true
      
    }),
    UserModule,AuthModule,MailModule,UploadModule,PostModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
