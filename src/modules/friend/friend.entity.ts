import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { FRIENDSHIPSTATUS } from "./enums";
import { UserEntity } from "../user/user.entity";

@Entity('friendships')

export class FriendShipsEntity extends BaseEntity{

    @Column({type:'enum',enum:FRIENDSHIPSTATUS,default:FRIENDSHIPSTATUS.PENDING})
    status:FRIENDSHIPSTATUS

    @Column({name:'requester_id',nullable:true})
    requester_id:number

    @Column({name:'addressee_id',nullable:true})
    addressee_id:number

    @ManyToOne(()=> UserEntity, (user)=> user.sentFriendRequest,{onDelete:'CASCADE'})
    @JoinColumn({name:'requester_id'})
    requester: UserEntity

    @ManyToOne(()=>UserEntity,(user)=>user.receivedFriendRequest,{onDelete:'CASCADE'})
    @JoinColumn({name:'addressee_id'})
    addressee:UserEntity
}