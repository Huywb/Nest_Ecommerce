import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateUserDto } from './dto/updateUser.dto';
import bcrypt from 'bcryptjs';
import { changePasswordDto } from './dto/changePassword.dto';

@Injectable()
export class UserService {
    private SALT = 10
    constructor(private readonly prisma: PrismaService){}

    async findOne(userId: string){
        const myUser = await this.prisma.user.findUnique({where: {id : userId}})
        if(!myUser){
            throw new NotFoundException()
        }
        return myUser
    }

    async getAllUser(){
        const listUser = await this.prisma.user.findMany()
        if(!listUser){
            throw new NotFoundException()
        }
        return listUser
    }

    async updateUser(userId:string,UpdateUser : updateUserDto){
        const user = await this.prisma.user.findUnique({where:{id: userId}})
        if(!user){
            throw new UnauthorizedException()
        }
        const updateUser = await this.prisma.user.update({
            where:{id: userId},
            data:{
                ...UpdateUser
            }
        })
        if(!updateUser){
            throw new NotFoundException()
        }
        return updateUser
    }

    async updatePasswordUser(id : string,ChangePassword: changePasswordDto){
        const {currentPassword, newPassword} = ChangePassword
        const user = await this.prisma.user.findUnique({
            where:{id}
        })
        
        if(!user || !currentPassword || !newPassword){
            throw new UnauthorizedException()
        }

        let compare = await bcrypt.compare(currentPassword,user.password)
        if(!compare){
            throw new UnauthorizedException()
        }

        let hassPass = await bcrypt.hash(newPassword,this.SALT)
        const updateUser = await this.prisma.user.update({
            where: {id},
            data: {
                password: hassPass
            }
        })
        return updateUser
    }

    async removeUser(userId: string){
        const user = await this.prisma.user.findUnique({
            where:{id : userId}
        })

        if(!user){
            throw new UnauthorizedException()
        }
        await this.prisma.user.delete({where: {id: userId}})
        
        return {message:"Delete user success"}
    }

}
