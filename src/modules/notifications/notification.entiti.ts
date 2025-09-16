import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Type_Notification } from "./enums";
import { RelatedType } from "../user/enums";
import { UserEntity } from "../user/user.entity";

@Entity('notification')
export class NotificationEntity extends BaseEntity {

    @Column({name:'user_id'})
    user_id : number
 
    @Column({name:'actor_id'})
    actor_id: number

    @Column({type:'enum',name:'type_notification',enum:Type_Notification})
    type_notification: Type_Notification

    @Column({name:'related_type',type:'enum',enum:RelatedType,nullable:true})
    related_type:RelatedType

    @Column({name:'related_id',nullable:true})
    related_id: number


    @ManyToOne(()=>UserEntity,(user)=>user.userNotifi)
    @JoinColumn({name:'user_id'})
    userNotifi:UserEntity

    @ManyToOne(()=>UserEntity,(user)=>user.actorNotifi)
    @JoinColumn({name:'actor_id'})
    actorNotifi:UserEntity

}