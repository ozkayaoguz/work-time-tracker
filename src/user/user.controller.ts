import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/auth-public.decorator';
import { DefaultApiResponse, PaginatedApiResponse } from '../utils/default-api-response.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserRequestDto } from './dto/find-user-request.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create user', description: "**Authentication not required** for now" })
  @DefaultApiResponse({ type: UserDto })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Find user' })
  @PaginatedApiResponse(UserDto)
  find(@Query() dto: FindUserRequestDto) {
    return this.userService.find(dto);
  }
}
