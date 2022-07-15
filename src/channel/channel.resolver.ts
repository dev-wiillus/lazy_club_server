import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { ChannelService } from "./channel.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";


@Resolver()
export class ChannelResolver {
    constructor(private readonly channelService: ChannelService) { }

    @Mutation(returns => Boolean)
    async createChannel(@Args('input') createChannelDto: CreateChannelDto): Promise<boolean> {
        try {
            await this.channelService.create(createChannelDto)
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    @Mutation(returns => Boolean)
    async updateChannel(@Args('input') updateChannelDto: UpdateChannelDto): Promise<boolean> {
        try {
            await this.channelService.update(updateChannelDto)
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }
}