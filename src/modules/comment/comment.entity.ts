import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
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
    
    @Column({name:'parent_id',nullable:true})
    parent_id: number

    @Column({default:0,name:'reply_count'})
    reply_count:number

    
    @ManyToOne(()=> UserEntity, (user) => user.comments)
    @JoinColumn({name:'user_id'})
    user:UserEntity

    @ManyToOne(()=>PostEntity,(post)=>post.comments)
    @JoinColumn({name:'post_id'})
    post:PostEntity

    @ManyToOne(()=>CommentEntity, (comment)=>comment.replies,{nullable:true,onDelete:'CASCADE'})
    @JoinColumn({name:'parent_id'})
    parent:CommentEntity

    @OneToMany(()=>CommentEntity,(comment)=>comment.parent,{
        cascade:true,
        
    })
    replies:CommentEntity[]

    @Column({default:false,name:'is_edited'})
    is_edited: boolean

    @Column({nullable:true,name:'edit_at'})
    edit_at:Date


    



}