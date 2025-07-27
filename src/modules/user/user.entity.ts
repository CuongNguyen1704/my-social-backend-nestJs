import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { GENDER } from './enums';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({nullable:true})
  name: string;

  @Column({nullable:true})
  password: string;

  @Column({ nullable: true })
  refresh_token?: string;

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

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleteAt?: Date
}
