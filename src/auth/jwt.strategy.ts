import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { ExtractJwt, Strategy, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import { JWT_SECRET } from './auth.module';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

export const STRATEGY_NAME = 'jwt-strategy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, STRATEGY_NAME) {
  constructor() {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
        passReqToCallback: true,
      } as StrategyOptions,
      (req, payload, done: VerifiedCallback) => {
        this.verifyPayload(payload)
          .then((dto) => done(null, dto))
          .catch((err) => done(err, null));
      },
    );
  }

  async verifyPayload(payload: any) {
    return plainToInstance(JwtPayloadDto, payload);
  }
}
