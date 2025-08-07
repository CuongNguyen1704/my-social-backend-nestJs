import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PostEntity } from '../post/post.entity';

@Entity('images')
export class ImageEntity extends BaseEntity {
  @Column()
  url: string;

  @Column({ name: 'post_id', nullable: false })
  post_id: number;

  @ManyToOne(() => PostEntity, (post) => post.images, { onDelete: 'CASCADE',nullable:false })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}
