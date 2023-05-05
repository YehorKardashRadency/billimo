import { FactoryProvider } from '@nestjs/common';
import { CurrentUser } from './user.model';
import { REQUEST } from '@nestjs/core';

export const USER = 'USER';

export const UserProvider: FactoryProvider<() => CurrentUser> = {
  provide: USER,
  useFactory: (req) => () => {
    return req.user as CurrentUser;
  },
  inject: [REQUEST],
};
