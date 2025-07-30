import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModul } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { LocalStrategy } from "../passport/local.strategy";
import { JwtStrategy } from "../passport/jwt.strategy";
import { MailModule } from "../mail/mail.module";

@Module({
    controllers: [AuthController],
    providers: [AuthService,LocalStrategy,JwtStrategy],
    imports: [
        UserModul,
        PassportModule,
        JwtModule.register({
            secret: 'key',
            signOptions: {expiresIn: '10h'}
        }),
        TypeOrmModule.forFeature([UserEntity]),
        MailModule
    ]
})
export class AuthModule {

}