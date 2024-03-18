import AssetsController, { cacheControlHandler } from '../cache/controller.ts';
import EnvironmentMiddleware from '../environment/middleware.ts';

import { signal } from '@preact/signals';

const pageMatter = signal<string>(''); //signal<{ [key: string]: string }>({});

const handler = [
	cacheControlHandler,
];

const initEnvironmentMiddleware = () => EnvironmentMiddleware.instance();
const initCacheMiddleware = () => AssetsController.instance();

export { handler, initCacheMiddleware, initEnvironmentMiddleware, pageMatter };
