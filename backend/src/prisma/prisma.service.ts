import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";



@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit{
    constructor(
        private readonly configService: ConfigService
    ){
        const adapter = new PrismaPg(configService.get<string>('DATABASE_URL') || "")
        super({adapter})
    }

    async onModuleDestroy() {
        this.$disconnect()
    }
    async onModuleInit() {
        this.$connect()
    }
    
}