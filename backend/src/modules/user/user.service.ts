import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateUserDto } from './dto/updateUser.dto';
import bcrypt from 'bcryptjs';
import { changePasswordDto } from './dto/changePassword.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  private SALT = 10;
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getAllUser(): Promise<UserResponseDto[]> {
    const listUser = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
    if (!listUser) {
      throw new NotFoundException();
    }
    return listUser;
  }

  async updateUser(
    userId: string,
    UpdateUser: updateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    const updateUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...UpdateUser,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });
    if (!updateUser) {
      throw new NotFoundException();
    }
    return updateUser;
  }

  async updatePasswordUser(
    id: string,
    ChangePassword: changePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = ChangePassword;
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || !currentPassword || !newPassword) {
      throw new UnauthorizedException();
    }

    let compare = await bcrypt.compare(currentPassword, user.password);
    if (!compare) {
      throw new UnauthorizedException();
    }

    let hassPass = await bcrypt.hash(newPassword, this.SALT);
    const updateUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hassPass,
      },
    });
    return { message: 'Password changed successfully' };
  }

  async removeUser(userId: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    await this.prisma.user.delete({ where: { id: userId } });

    return { message: 'Delete user success' };
  }
}
