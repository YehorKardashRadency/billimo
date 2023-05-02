import type { PlatformRef, NgZone } from '@angular/core';

declare global {
  interface Window {
    env: {
      [key: string]: string;
    };

    platform?: {
      [version: string]: PlatformRef;
    };

    ngZone?: NgZone;
  }
}
