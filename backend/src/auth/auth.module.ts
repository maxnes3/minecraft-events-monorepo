import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { publicRuntimeConfig } from '@app/shared/config';
import { AuthGuard } from './presentation/guards/auth.guard';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: publicRuntimeConfig.jwt.secret,
        signOptions: { expiresIn: publicRuntimeConfig.jwt.expiresIn }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard]
})
export class AuthModule {}
