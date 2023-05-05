import { Injectable } from '@nestjs/common';
import { CurrentUser } from './modules/user/user.model';

@Injectable()
export class AppService {
  getHello(user: CurrentUser): string {
    return `Hello ${user.name},${user.role} from ${user.companyId} with ${user.id}`;
  }
}
