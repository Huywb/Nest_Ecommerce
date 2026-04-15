import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,ExtractJwt} from 'passport-jwt'
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(
        private readonly prisma:PrismaService,
        private readonly configService: ConfigService
    ) { super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration : false,
        secretOrKey: configService.get<string>("JWT_SECRET")
    })}

    async validate(payload: {sub: string, email: string}){
        const user = await this.prisma.user.findUnique({where: {id: payload.sub}})
        if(!user){
            throw new UnauthorizedException()
        }
        return user
        
    }
}