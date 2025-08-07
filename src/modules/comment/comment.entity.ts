import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { PostEntity } from "../post/post.entity";

@Entity('comments')
export class CommentEntity extends BaseEntity{
    @Column()
    content:string

    @Column({default:0})
    like_count:number

    @Column({name:'post_id',nullable:false})
    post_id:number

    @Column({name:'user_id',nullable:false})
    user_id:number
    
    @ManyToOne(()=> UserEntity, (user) => user.comments)
    @JoinColumn({name:'user_id'})
    user:UserEntity

    @ManyToOne(()=>PostEntity,(post)=>post.comments)
    @JoinColumn({name:'post_id'})
    post:PostEntity




}