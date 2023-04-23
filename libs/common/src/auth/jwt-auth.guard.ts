import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, tap, of } from 'rxjs';
import { AUTH_SERVICE } from '../constants';
import { UserDto } from '../dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;

    if (!jwt) {
      return false;
    }
    // aca mandamos el payload  { Authentication: jwt } que lo va a recibir la JwtStrategy del auth microservice y el messagePattern 'authenticate'
    return this.authService
      .send<UserDto>('authenticate', { Authentication: jwt })
      .pipe(
        tap((res) => {
          this.logger.log(res, 'user to attach to request');
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}

// const _port = Number(configService.get<number>('AUTH_TCP_PORT'));
// this.authService = ClientProxyFactory.create({
//   transport: Transport.TCP,
//   options: {
//     host: '127.0.0.1',
//     port: _port,
//   },
// });
