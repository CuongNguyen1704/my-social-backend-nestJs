import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { GENDER } from './enums';
import { BaseEntity } from 'src/common/entities/base.entity';
import { PostEntity } from '../post/post.entity';

@Entity('users')
export class UserEntity extends BaseEntity {


  @Column({ unique: true })
  email: string;

  @Column({nullable:true})
  name: string;

  @Column({nullable:true})
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @BeforeInsert()
  async hassPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @Column({ type: 'varchar', nullable: true })
  forgotPasswordToken: string | null;

  @Column({ nullable: true })
  forgotPasswordExpireAt: Date;


  @Column({nullable:true})
  fullName: string

  @Column({nullable:true})
  avatar:string

  @Column({nullable:true})
  dateOfBirth:Date

  @Column({type:'enum',enum:GENDER,nullable:true})
  gender: string

  @Column({nullable:true})
  fullAddress:string

  @Column({nullable:true})
  phone:string

  @OneToMany(()=> PostEntity, (post) => post.user)
  posts: PostEntity[]


}
