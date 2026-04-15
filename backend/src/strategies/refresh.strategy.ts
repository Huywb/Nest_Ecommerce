import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy,ExtractJwt} from 'passport-jwt'
import { PrismaService } from "src/prisma/prisma.service";
import {Request} from 'express'
import bcrypt from "bcryptjs";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy,'jwt-refresh'){
    constructor(
        private readonly prisma:PrismaService,
        private readonly configService: ConfigService
    ) { super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration : false,
        secretOrKey: configService.get<string>("JWT_SECRET_REFRESH"),
        passReqToCallback : true
    })}

    async validate(req: Request,payload: {sub: string, email: string}){
        const authHeader = req.headers.authorization
        if(!authHeader){
            throw new UnauthorizedException()
        }
        const token = authHeader.replace("Bearer","").trim()
        if(!token){
            throw new UnauthorizedException()
        }
        const user = await this.prisma.user.findUnique({where:{id:payload.sub}})
        if(!user){
            throw new UnauthorizedException()
        }
        const checkToken = bcrypt.compare(token, user?.refreshToken || "")
        if(!checkToken){
            throw new UnauthorizedException()
        }
        return {
            user
        }
    }
}