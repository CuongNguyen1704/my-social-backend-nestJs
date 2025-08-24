import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendRequestEntity } from "./entities/friend_request.entity";
import { FriendRequestService } from "./services/friend_request.service";
import { FriendRequestController } from "./controllers/friend_request.controller";
import { UserModule } from "../user/user.module";
import { FriendShipEntity } from "./entities/friendship.entity";
import { friendShipSerice } from "./services/friend_ship.service";
import { FriendShipController } from "./controllers/friend_ship.controller";

@Module({
    imports:[TypeOrmModule.forFeature([FriendRequestEntity,FriendShipEntity]),UserModule],
    providers:[FriendRequestService,friendShipSerice],
    controllers:[FriendRequestController,FriendShipController],
    exports:[FriendRequestService,friendShipSerice]
})

export class FriendModule{}