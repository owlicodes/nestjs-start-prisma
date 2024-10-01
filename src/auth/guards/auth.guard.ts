import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import { AppConfigService } from "../../config/config.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const allowNullResponse = this.reflector.get<boolean>(
      "allowNullResponse",
      context.getHandler(),
    );

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.appConfigService.getJwtAccessSecret(),
      });

      request.user = payload;
    } catch {
      if (allowNullResponse) {
        request.user = null;
        return true;
      } else {
        throw new UnauthorizedException("No authorization token found");
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
