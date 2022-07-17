import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentEntity } from './entities/content.entity';
import { ContentFileEntity } from './entities/content_file.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ContentEntity,
            ContentFileEntity,
        ]),
    ],
    controllers: [],
    providers: []
})
export class ContentModule { }
