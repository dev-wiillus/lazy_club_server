import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
	type: 'mysql',
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	entities: ['dist/entity/*.entity{.ts,.js}'],
	synchronize: false,
	autoLoadEntities: true,
	logging: true,
	migrations: ['src/db/migration/*{.ts,.js}'],
	// "cli": {
	// 	"entitiesDir": "dist/entity",
	// 	"migrationsDir": "src/db/migration"
	// }
} as TypeOrmModuleOptions;

export = config;
