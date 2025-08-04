import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { LocalStrategy } from "../passport/local.strategy";
import { JwtStrategy } from "../passport/jwt.strategy";
import { MailModule } from "../mail/mail.module";
import { env } from "@usefultools/utils";

@Module({
    controllers: [AuthController],
    providers: [AuthService,LocalStrategy,JwtStrategy],
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: env.getAsStr('JWT_SECRET_KEY'),
            signOptions: {expiresIn: env.getAsStr('JWT_EXPIRES_IN')}
        }),
        TypeOrmModule.forFeature([UserEntity]),
        MailModule
    ]
})
export class AuthModule {

}