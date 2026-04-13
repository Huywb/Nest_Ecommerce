import { Body, Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { RefreshGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService:AuthService){}


    async register(@Body() registerDto: registerDto){
        return this.authService.register(registerDto)
    }

    @UseGuards(RefreshGuard)
    async refresh(userId: string){

    }
}
