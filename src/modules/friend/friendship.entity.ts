import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { FRIENDSHIP } from "./enums";
import { UserEntity } from "../user/user.entity";
import { use } from "passport";

@Entity('friendships')
export class FriendShipEntity extends BaseEntity{

    @Column({name:'user_id',nullable:true})
    user_id:number

    @Column({name:'friend_id',nullable:true})
    friend_id:number

    @Column({name:'status',type:'enum',enum:FRIENDSHIP,default:FRIENDSHIP.ACTIVE})
    status:FRIENDSHIP

    @ManyToOne(()=>UserEntity,(user)=>user.friendshipAsUser,{onDelete:'CASCADE'})
    @JoinColumn({name:'user_id'})
    user:UserEntity

    @ManyToOne(()=>UserEntity,(user)=>user.friendshipAsFriend,{onDelete:'CASCADE'})
    @JoinColumn({name:'friend_id'})
    friend:UserEntity
}