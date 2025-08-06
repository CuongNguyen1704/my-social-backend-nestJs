
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export class BaseEntity {
    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn() 
    updateAt: Date

    @DeleteDateColumn()
    deleteAt: Date
}