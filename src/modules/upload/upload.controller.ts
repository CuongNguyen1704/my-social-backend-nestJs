import { Controller, Delete, Param, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService){}

    @Post('upload-file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File){
        return await this.uploadService.upload(file)
    }

    @Delete('')
    async delete(@Query('key') fullUrl:string){
        await this.uploadService.delete(fullUrl)
        return {
            message: "File deleted successfully"
        }
    }
}