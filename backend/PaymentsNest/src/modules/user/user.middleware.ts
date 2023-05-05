import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Role, CurrentUser } from './user.model';
import { IncomingMessage } from 'http';
function parseRole(role_str: string): Role {
  switch (role_str) {
    case 'Admin':
      return Role.Admin;
    case 'Director':
      return Role.Director;
    case 'Manager':
      return Role.Manager;
    case 'Empty':
      return Role.Empty;
    default:
      return Role.Empty;
  }
}

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: IncomingMessage, res: any, next: () => void) {
    const id = req.headers['claim_id'] as string;
    const name = req.headers['claim_sub'] as string;
    const role = req.headers['claim_role'] as string;
    const company_id = req.headers['claim_companyid'] as string;

    if ([id, name, role, company_id].includes(undefined)) {
      throw new ForbiddenException();
    }
    const user: CurrentUser = {
      id: parseInt(id),
      companyId: parseInt(company_id),
      role: parseRole(role),
      name: name,
      userAgent: req.headers['user-agent'] as string,
      ipAddress: req.socket.remoteAddress,
    };
    (req as any).user = user;
    next();
  }
}
