import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DefaultApiResponse } from '../utils/default-api-response.decorator';
import { Public } from './auth-public.decorator';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Login' })
  @DefaultApiResponse({ type: LoginResponseDto })
  login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }
}
