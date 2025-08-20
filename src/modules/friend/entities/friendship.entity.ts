import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { FRIEND_SHIP_STATUS } from "../enums";
import { UserEntity } from "../../user/user.entity";


@Entity('friendships')
export class FriendShipEntity extends BaseEntity{

    @Column({name:'user_id',nullable:true})
    user_id:number

    @Column({name:'friend_id',nullable:true})
    friend_id:number

    @Column({name:'status',type:'enum',enum:FRIEND_SHIP_STATUS,default:FRIEND_SHIP_STATUS.ACTIVE})
    status:FRIEND_SHIP_STATUS

    @ManyToOne(()=>UserEntity,(user)=>user.friendshipAsUser,{onDelete:'CASCADE'})
    @JoinColumn({name:'user_id'})
    user:UserEntity

    @ManyToOne(()=>UserEntity,(user)=>user.friendshipAsFriend,{onDelete:'CASCADE'})
    @JoinColumn({name:'friend_id'})
    friend:UserEntity
}