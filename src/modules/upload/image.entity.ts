import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PostEntity } from "../post/post.entity";

@Entity('images')

export class ImageEntity extends BaseEntity {

    @Column()
    url:string

    @ManyToOne(()=> PostEntity, (post) => post.images,{onDelete:'CASCADE'})
    @JoinColumn({name:'post_id'})
    post:PostEntity
}