import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit{
    constructor(){
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL
        })
        super({adapter, log: process.env.NODE_ENV === 'development' ? ['query','error','warn'] : ['error']})
    }

    async onModuleDestroy() {
        await this.$disconnect()
        console.log("Database Disconnecting")
    }

    async onModuleInit() {
        await this.$connect()
        console.log("Database connected successfully")
    }

}
