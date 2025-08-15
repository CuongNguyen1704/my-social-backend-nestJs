import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { RelatedType } from "../user/enums";
import { PostEntity } from "../post/post.entity";
@Unique(['related_type','related_id','user_id'])
@Entity('likes')
export class LikeEntity extends BaseEntity {
    @Column({name:'related_type',type:'enum',enum:RelatedType,nullable:false})
    related_type:string

    @Column({name:'related_id',nullable:false})
    related_id:number

    @Column({name:'user_id'})
    user_id:number

    @ManyToOne(()=>UserEntity,(user)=>user.likes)
    @JoinColumn({name:'user_id'})
    user:UserEntity
    




}