import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ImageEntity } from '../image/image.entity';
import { CommentEntity } from '../comment/comment.entity';

@Entity('posts')
export class PostEntity extends BaseEntity {

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true,default:0 })
  comment_count: number;

  @Column({default:0 ,name:'like_count'}) 
  like_count: number;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ImageEntity, (image) => image.post, { cascade: true })
  images: ImageEntity[];

  @OneToMany(()=>CommentEntity,(comment)=> comment.post,{cascade:true})
  comments:CommentEntity[]
}
