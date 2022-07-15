import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { JwtModuleOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';

@Module({
})
@Global()
export class JwtModule {
    static forRoot(optioins: JwtModuleOptions): DynamicModule {
        return {
            module: JwtModule,
            exports: [JwtService],
            providers: [
                { provide: CONFIG_OPTIONS, useValue: optioins }, JwtService]
        }
    }
}
