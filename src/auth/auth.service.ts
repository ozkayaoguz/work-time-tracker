import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) throw new UnauthorizedException();

    const passwordValid = await this.userService.isPasswordValid(dto.password, user.password);
    if (!passwordValid) throw new UnauthorizedException();

    const res = new LoginResponseDto();
    res.accessToken = await this.createAccessToken(user);
    res.user = plainToInstance(UserDto, user);

    return res;
  }

  createAccessToken(payload: JwtPayloadDto): Promise<string> {
    const filteredPayload = plainToInstance(JwtPayloadDto, payload);
    return this.jwtService.signAsync(instanceToPlain(filteredPayload));
  }
}
