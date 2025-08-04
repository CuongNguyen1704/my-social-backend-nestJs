import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { UsersRepository } from "./repositories/user.repository";
import { UploadModule } from "../upload/upload.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        UploadModule
    ],
    controllers: [UserController],
    providers: [UserService,JwtAuthGuard,LocalAuthGuard,UsersRepository],
    exports: [UserService]
})

export class UserModule {

}