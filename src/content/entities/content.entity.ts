import {
	Field,
	InputType,
	ObjectType,
	registerEnumType,
} from '@nestjs/graphql';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	RelationId,
} from 'typeorm';
import {
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	Length,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { ContentFileEntity } from './content_file.entity';

export enum ContentCategory {
	BLOG = 'blog', // 블로그
	LIVE = 'live', // 라이브 스트리밍
}

registerEnumType(ContentCategory, { name: 'ContentCategoryType' });

export enum ContentStatus {
	DELETED = 'deleted', // 삭제
	NORMAL = 'normal', // 정상
	DRAFT = 'draft', // 임시저장
	PENDING = 'pending', // 최초 생성
}

registerEnumType(ContentStatus, { name: 'ContentStatusType' });

@InputType('ContentInput')
@ObjectType('ContentOutput')
@Entity('Content')
export class ContentEntity extends CoreEntity {
	/* 
		콘텐츠
	*/

	@Field((type) => String, { nullable: true })
	@Column({ length: 100, nullable: true })
	@IsString()
	@Length(1, 100)
	@IsOptional()
	title: string;

	@Field((type) => ContentCategory, { defaultValue: ContentCategory.BLOG })
	@Column({
		comment: '콘텐츠 종류',
		type: 'enum',
		enum: ContentCategory,
		default: ContentCategory.BLOG,
	})
	@IsEnum(ContentCategory)
	@IsOptional()
	category: ContentCategory;

	@Field((type) => String, { nullable: true })
	@Column({ comment: '콘텐츠 내용', nullable: true })
	@IsOptional()
	content?: string;

	@Field((type) => Number)
	@Column({ comment: '조회 수', default: 0 })
	@IsNumber()
	hit: number;

	@Field((type) => ContentStatus, { defaultValue: ContentStatus.PENDING })
	@Column({
		comment: '콘텐츠 상태',
		type: 'enum',
		enum: ContentStatus,
		default: ContentStatus.PENDING,
	})
	@IsEnum(ContentStatus)
	@IsOptional()
	status: ContentStatus;

	@Field((type) => UserEntity, { description: '최초 작성자' })
	@ManyToOne((type) => UserEntity, (writer) => writer.id)
	writer: UserEntity;

	@RelationId((content: ContentEntity) => content.writer)
	writerId: number;

	@Field((type) => ChannelEntity)
	@ManyToOne((type) => ChannelEntity, (channel) => channel.id, { onDelete: 'CASCADE' })
	channel: ChannelEntity;

	@Field((type) => [ContentFileEntity], { nullable: true })
	@OneToMany((type) => ContentFileEntity, (contentFiles) => contentFiles.id, {
		nullable: true,
	})
	contentFiles?: ContentFileEntity[];
}
