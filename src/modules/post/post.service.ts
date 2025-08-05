import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "./post.entity";
import { Repository } from "typeorm";
import { ImageEntity } from "../upload/image.entity";
import { CreatePostDto } from "./dto/create.dto";

export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository:Repository<PostEntity>,

        @InjectRepository(ImageEntity)
        private readonly imageRepository:Repository<ImageEntity>
    ){}

    async create(dto:CreatePostDto){

        const post = this.postRepository.create({
            user:{id:dto.user_id},
            content:dto.content,
            title:dto.title
        })

        const savePost = await this.postRepository.save(post)

        const ImageEntities = dto.images.map((url)=>{
            const image = new ImageEntity()
            image.url = url,
            image.post = savePost;
            return image
        })

        await this.imageRepository.save(ImageEntities)

        return {
            ...savePost,
            image:ImageEntities
        }

    }
}