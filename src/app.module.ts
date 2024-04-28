import path from 'path';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import mailConfig from './config/mail.config';
import googleConfig from './config/google.config';
import databaseConfig from './config/database.config';
import { Module } from '@nestjs/common';
import { HeaderResolver } from 'nestjs-i18n';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { HomeModule } from './home/home.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { AllConfigType } from './config/config.type';
import { MailerModule } from './mailer/mailer.module';
import { ForgotModule } from './forgot/forgot.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SessionModule } from './session/session.module';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './database/typeorm-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, googleConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ForgotModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
    VideosModule,
  ],
})
export class AppModule {}
