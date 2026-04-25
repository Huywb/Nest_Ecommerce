import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/modules/auth/guards/role.guard';
import { UserService } from './user.service';
import type { RequestWithUser } from 'src/common/interface/Request-interface';
import { Roles } from 'src/common/decorator/role.decorator';
import { updateUserDto } from './dto/updateUser.dto';
import { changePasswordDto } from './dto/changePassword.dto';
import { UserResponseDto } from './dto/user-response.dto';


@ApiTags('user')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard,RolesGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Get('me')
    @ApiOperation({summary:"Get User"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async getProfile(@Req() req: RequestWithUser): Promise<UserResponseDto>{
        return this.userService.findOne(req.user.id)
    }

    @Get()
    @Roles("ADMIN")
    @ApiOperation({summary:"Get List user"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async findAll(): Promise<UserResponseDto[]>{
        return this.userService.getAllUser()
    }

    @Get(":id")
    @Roles("ADMIN")
     @ApiOperation({summary:"Get User by Id"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async getUserById(@Param('id') userId: string) : Promise<UserResponseDto>{
        return this.userService.findOne(userId)
    }


    @Patch("me")
    @ApiOperation({summary:"Update User by Id"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async updateUser(userId: string, @Body() UpdateUser : updateUserDto): Promise<UserResponseDto>{
        return this.userService.updateUser(userId,UpdateUser)
    }

    @Patch(":id/password")
    @ApiOperation({summary:"Update Password User by Id"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async updatePasswordUser(@Param('id') id : string, @Body() ChangePassword: changePasswordDto) : Promise<{ message: string }>{
        return this.userService.updatePasswordUser(id,ChangePassword)
    }

    @Delete(":id")
    @Roles('ADMIN')
    @ApiOperation({summary:"R Password User by Id"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async removeUser(@Param('id') id : string): Promise<{ message: string }>{
        return this.userService.removeUser(id)
    }

}
