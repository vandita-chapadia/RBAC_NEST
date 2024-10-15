import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtAccessStrategy } from 'src/common/providers/access-jwt.strategy';
import { CaslAbilityFactory } from 'src/casl/casl.factory';

@Module({
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    JwtAccessStrategy,
    CaslAbilityFactory,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
