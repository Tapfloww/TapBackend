import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PoliciesModule } from '../policies/policies.module';

@Module({
  imports: [PoliciesModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
