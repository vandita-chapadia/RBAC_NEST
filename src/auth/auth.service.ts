import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string) {
    const user = await this.prismaService.users.findUnique({
      where: { user_email: email },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const payload = { id: user.user_id, email: user.user_email };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: 'jwt-secret',
      }),
      user,
    };
  }

  async createUser(email: string, role_id: number) {
    const existingUser = await this.prismaService.users.findUnique({
      where: { user_email: email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    const roleExists = await this.prismaService.role.findUnique({
      where: { role_id: role_id },
    });

    if (!roleExists) {
      throw new BadRequestException('Invalid roleId. Role does not exist.');
    }

    const newUser = await this.prismaService.users.create({
      data: {
        user_email: email,
        role_id: role_id,
      },
    });

    return newUser;
  }

  async findUser(userId: number) {
    const user = await this.prismaService.users.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async deleteUser(userId: number) {
    return this.prismaService.users.delete({ where: { user_id: userId } });
  }

  async findAll() {
    return this.prismaService.users.findMany();
  }
}
