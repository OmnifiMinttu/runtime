import AssetsMiddleware, { cacheControlHandler } from '../cache/middleware.ts';
import EnvironmentMiddleware from '../environment/middleware.ts';

import { signal } from '@preact/signals';

const pageMatter = signal<string>('');//signal<{ [key: string]: string }>({});

const handler = [
	cacheControlHandler,
];

const initEnvironmentMiddleware = () => EnvironmentMiddleware.instance();
const initCacheMiddleware = () => AssetsMiddleware.instance();

export { handler, initCacheMiddleware, initEnvironmentMiddleware, pageMatter };
