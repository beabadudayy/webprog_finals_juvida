import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuestbookController } from './guestbook.controller';
import { GuestbookService } from './guestbook.service';

@Module({
  imports: [],
  controllers: [AppController, GuestbookController],
  providers: [AppService, GuestbookService],
})
export class AppModule {}
