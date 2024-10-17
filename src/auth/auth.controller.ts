import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/common/decorator/public.decorator';
import { LoginDto } from './dto/signin.dto';
import { checkAbilities } from 'src/common/decorator/policy.decorator';
import { PolicyGuard } from 'src/common/guards/policy.guard';
import { ForbiddenError, subject } from '@casl/ability';
import { CaslAbilityFactory } from 'src/casl/casl.factory';
import { RegisterDto } from './dto/register.dto';

@UseGuards(PolicyGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}
  @PublicRoute()
  @Post('login')
  public login(@Body() loginDTO: LoginDto) {
    return this.authService.signIn(loginDTO.email);
  }

  @checkAbilities({ action: 'create', subject: 'users' })
  @Post('create')
  public createUser(@Body() registerDTO: RegisterDto, @Request() req) {
    const ability = this.caslAbilityFactory.createAbility(
      req.user.role.permission,
    );

    ForbiddenError.from(ability)
      .setMessage('Not Allowed')
      .throwUnlessCan('create', subject('users', req.user));
    return this.authService.createUser(registerDTO.email, registerDTO.role_id);
  }

  @checkAbilities({ action: 'read', subject: 'users' })
  @Get('user/:id')
  public findUser(@Param('id') userId: string) {
    return this.authService.findUser(+userId);
  }

  @checkAbilities({ action: 'read', subject: 'users' })
  @Get('user/')
  async findAll() {
    return this.authService.findAll();
  }

  @checkAbilities({ action: 'delete', subject: 'users' })
  @Delete('user/:id')
  async deleteUser(@Param('id') userId: string, @Request() req) {
    const user = await this.authService.findUser(+userId);

    const ability = this.caslAbilityFactory.createAbility(
      req.user.role.permission,
    );

    ForbiddenError.from(ability)
      .setMessage('Not Allowed')
      .throwUnlessCan('delete', subject('users', user));
    return this.authService.deleteUser(+userId);
  }
}
