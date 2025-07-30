import {
  ConflictException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';
import { CreateUserDto } from './dto/create-user.dto';
import { EXIST_ERROR } from './messages';
import { promises } from 'dns';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import * as path from 'path';
import * as fs from 'fs';
import { GetOneDto } from './dto/get-one-user.dto';
import { getManyUserByname } from './dto/get-many-by-name.dto';
import { ILike } from 'typeorm';
import { UserFilterDto } from './dto/filter-user.dto';
import { UsersRepository } from './repositories/user.repository';
import { PaginatedReponse } from 'src/common/response/response.interface';
import { paginatedReponse } from 'src/shared/helpers/paginate-response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly RepositoryUser: UsersRepository
  ) {}

  async createUser(
    userData: CreateUserDto,
  ): Promise<CreateUserDto> {
    const existingUser = await this.userRepository.findOneBy({
      email: userData.email,
    });
    if (existingUser) {
      throw new ConflictException(EXIST_ERROR.EMAIL_EXIT);
    }
    const user = this.userRepository.create(userData);
    const saveUser = await this.userRepository.save(user);
    return plainToInstance(CreateUserDto,saveUser,{
      excludeExtraneousValues:true
    })
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const status = bcrypt.compareSync(password, user.password);
    console.log(status);
    if (status) {
      return user;
    }
    return null;
  }

  async saveRefreshToken(refres_token: string, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const hashedRefrehToken = await bcrypt.hash(refres_token, 10); // mã hóa refrestoken
    user.refreshToken = hashedRefrehToken;

    return this.userRepository.save(user);
  }

  async verifyRefreshToken(refres_token: string, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user && user.refreshToken) {
      const status = await bcrypt.compare(refres_token, user.refreshToken);
      if (status) {
        return user;
      }
    }
    return false;
  }

  async softDelete(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    return this.userRepository.softDelete(userId);
  }

  async update(
    id: number,
    updateUser: Partial<UserEntity>,
  ): Promise<UpdateUserDto> {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException('User  không tồn tại');
    }
    if (updateUser && updateUser.password) {
      updateUser.password = await bcrypt.hash(updateUser.password, 10);
    }
    await this.userRepository.update(id, updateUser);
    const userUpdate = await this.userRepository.findOneBy({ id });
    return plainToInstance(UpdateUserDto, userUpdate, {
      excludeExtraneousValues: true,
    });
  }

  async getOneUser(id:number):Promise<GetOneDto>{
    const user = await this.userRepository.findOneBy({id})
    if(!user){
        throw new NotFoundException("User không tồn tại")
    }
    return plainToInstance(GetOneDto,user,{
      excludeExtraneousValues:true
    })
  }

  async getManyUser(nameDto:getManyUserByname):Promise<UserEntity[]>{
      const users = await this.userRepository.find({
        where:{
            name: ILike(`%${nameDto.name}%`)
      }})

      return users
  }

  async fillMany(userFilterDto:UserFilterDto):Promise<PaginatedReponse<UpdateUserDto>>{
     const { users, total} = await this.RepositoryUser.fillMany(userFilterDto)
     const transformerUsers = plainToInstance(UpdateUserDto,users,{
      excludeExtraneousValues:true
     })
     return paginatedReponse(transformerUsers,total,userFilterDto.page ?? 1,userFilterDto.limit??3)
  }
}
