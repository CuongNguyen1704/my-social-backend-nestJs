import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendRequestEntity } from "./entities/friend_request.entity";
import { FriendService } from "./services/friend_request.service";
import { FriendController } from "./controllers/friend.controller";
import { UserModule } from "../user/user.module";
import { FriendShipEntity } from "./entities/friendship.entity";

@Module({
    imports:[TypeOrmModule.forFeature([FriendRequestEntity,FriendShipEntity]),UserModule],
    providers:[FriendService],
    controllers:[FriendController],
    exports:[FriendService]
})

export class FriendModule{}