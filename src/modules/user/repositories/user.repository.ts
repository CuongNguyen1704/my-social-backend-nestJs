import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user.entity";
import { Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { UserFilterDto } from "../dto/filter-user.dto";
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ){}

    async fillMany(userFilterDto:UserFilterDto): Promise<{users: UserEntity[];total:number}>{
            const {filters,search,sort} = userFilterDto;
            const page = userFilterDto.page ?? 1
            const limit = userFilterDto.limit ?? 3

            const where :FindOptionsWhere<UserEntity> = {}

            if(filters){
                Object.entries(filters).forEach(([key,value])=>{
                        where[key] = value
                })
            }

            const searchConditions:FindOptionsWhere<UserEntity>[] = search 
            ? [
                 {...where,name:ILike(`${search}`)},
                 {...where,fullName:ILike(`${search}`)},
                 {...where,email:ILike(`${search}`)}
              ] : [where]

              const order : Record<string, 'ASC' | 'DESC'> = {}
              if(sort){
                const [filed,direction] = sort.split(':')
                order[filed] = direction.toUpperCase() as 'ASC' | 'DESC'
              }
              const [users, total] = await this.userRepository.findAndCount({
                where: searchConditions,
                order,
                skip:(page- 1) * limit,
                take:limit
              })
              console.log(total)
            return {users,total}
    }
}