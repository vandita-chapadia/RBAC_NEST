import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './common/guards/jwt-access.guard';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, ArticleModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    JwtService,
    { provide: APP_GUARD, useClass: JwtAccessGuard },
  ],
})
export class AppModule {}
