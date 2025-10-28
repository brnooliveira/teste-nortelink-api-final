import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwt-payload.type';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, senha: string) {
    const user = await this.usuariosService.findOneByEmail(email);

    if (user && (await bcrypt.compare(senha, user.senha))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { senha, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: Usuario) {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(jwtPayload),
      refresh_token: await this.createRefreshToken(user),
    };
  }

  async createRefreshToken(user: Usuario) {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const refreshToken = this.jwtService.sign(jwtPayload, { expiresIn: '7d' });
    user.refreshToken = refreshToken;
    await this.usuariosService.updateRefreshToken(user);
    return refreshToken;
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(refreshToken);
      const user = await this.usuariosService.findOneByEmail(decoded.email);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const jwtPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
      };

      return {
        access_token: this.jwtService.sign(jwtPayload),
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
