import { Inject, Injectable } from "@nestjs/common";
import { env } from "@usefultools/utils";
import { S3 } from "aws-sdk";



@Injectable()
export class UploadService {
    constructor(
        @Inject('S3_CLIENT') private readonly s3: S3,

        @Inject('UPLOAD_CONFIG')
        private readonly config: {
            driver: 's3';
            bucket: string,
            publicUrl: string | null
        }
    ){}
    async upload(file:Express.Multer.File){
            const {originalname} = file
            const key = `${new Date().getTime()}_${originalname}`;

            await this.s3
                .putObject({
                    Bucket: this.config.bucket,
                    Body:file.buffer,
                    Key: key,
                    ContentType:file.mimetype,
                })
                .promise();
            
                const url =  this.config.driver === 's3' ? `https://${this.config.bucket}.s3.amazonaws.com/${key}` : null   
                return url
    }

    // https://bucket10do.s3.amazonaws.com/1754221212686_iPhone-17-Pro-on-Desk-Centered-1.jpg

    async delete(key:string):Promise<void>{
            await this.s3.deleteObject({
                Bucket:this.config.bucket,
                Key: key
            })
            .promise();
    }
}