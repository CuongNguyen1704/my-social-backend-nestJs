import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendRequestEntity } from "./friend_request.entity";
import { FriendService } from "./friend_request.service";
import { FriendController } from "./friend.controller";
import { UserModule } from "../user/user.module";
import { FriendShipEntity } from "./friendship.entity";

@Module({
    imports:[TypeOrmModule.forFeature([FriendRequestEntity,FriendShipEntity]),UserModule],
    providers:[FriendService],
    controllers:[FriendController],
    exports:[FriendService]
})

export class FriendModule{}