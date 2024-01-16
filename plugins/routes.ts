import { Plugin } from '$fresh/server.ts';
import Error404Page from '../routes/_404.tsx';
import Error500Page from '../routes/_500.tsx';
import App from '../routes/_app.tsx';
import Layout from '../routes/_layout.tsx';

/**
 * App routes plugin provides templated routing to the core `_app` and `_layout` 
 * from the Fresh project structure to reduce duplication in apps that share the 
 * same base structure.
 * 
 * @returns A Fresh plugin routing to core components.
 */
function appRoutesPlugin(): Plugin {
	return {
		name: 'appRoutesPlugin',
		routes: [
			{
				path: '/_app',
				component: App,
			},
			{
				path: '/_layout',
				component: Layout,
			},
		],
	};
}

/**
 * Error routes plugin provides templated routing to standard error pages to reduce 
 * boilerplating.
 * 
 * @returns A Fresh plugin routing to error pages.
 */
function errorRoutesPlugin(): Plugin {
	return {
		name: 'errorRoutesPlugin',
		routes: [
			{
				path: '/404',
				component: Error404Page,
			},
			{
				path: '/500',
				component: Error500Page,
			},
		],
	};
}

export { appRoutesPlugin, errorRoutesPlugin };
