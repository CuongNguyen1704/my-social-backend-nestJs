import { Module } from "@nestjs/common";
import { NotificationController } from "./notifications.controller";
import { NotificationService } from "./notification.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "./notification.entiti";

@Module({
    imports:[TypeOrmModule.forFeature([NotificationEntity])],
    providers:[NotificationService],
    controllers:[NotificationController],
    exports:[NotificationService]
})

export class NotificationModule{} 