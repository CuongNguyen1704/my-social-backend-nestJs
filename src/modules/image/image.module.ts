import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageEntity } from "./image.entity";
import { UploadModule } from "../upload/upload.module";
import { PostModule } from "../post/post.module";
import { ImageService } from "./image.service";

@Module({
    imports:[TypeOrmModule.forFeature([ImageEntity]),UploadModule],
    providers:[ImageService],
    exports:[TypeOrmModule,ImageService],
    
    

})

export class ImageModule{}