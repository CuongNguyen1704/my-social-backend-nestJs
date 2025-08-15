import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendShipsEntity } from "./friend.entity";
import { FriendService } from "./friend.service";
import { FriendController } from "./friend.controller";
import { UserModule } from "../user/user.module";

@Module({
    imports:[TypeOrmModule.forFeature([FriendShipsEntity]),UserModule],
    providers:[FriendService],
    controllers:[FriendController],
    exports:[FriendService]
})

export class FriendModule{}