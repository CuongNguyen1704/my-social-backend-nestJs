import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationEntity } from "./notification.entiti";
import { Repository } from "typeorm";
import { Type_Notification } from "./enums";
import { RelatedType } from "../user/enums";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepository: Repository<NotificationEntity>

    ){}

    async saveNotifi(user_id:number,actor_id:number,post_id:number){
        await this.notificationRepository.save({
            user_id:user_id,
            actor_id:actor_id,
            type_notification:Type_Notification.LIKE,
            related_type: RelatedType.POST,
            related_id:post_id
        })
    }
}