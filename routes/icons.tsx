import { FreshContext, RouteConfig } from '$fresh/server.ts';
import { getApplicationIcon } from '../icons/application/application.ts';

const handler = {
	async GET(request: Request, context: FreshContext) {
		const url = new URL(request.url);
		console.log(url.pathname);
		console.log(context.params);

		//const applicationIconPath =
		const name = request.url.split('/').pop();

		console.log(name);

		if (name) {
			const fileBody = await getApplicationIcon(`${name}`);

			return new Response(fileBody, {
				headers: { 'content-type': 'image/svg+xml' },
			});
		} else {
			return new Response(context.params.path);
		}
	},
};

const config: RouteConfig = {
	// '^.*?(?<feature>mask|fav)?-?(icon|logo)-?(?<width>[0-9]*)(?<size>x?[0-9]*)\.(?<type>jpg|jpeg|png|svg|webp)$'
	routeOverride:
		'/images/icons/application/{:feature(mask|fav)}?{-}?(icon|logo){-}?{:width}?{x}?{:size}?.:type(jpg|jpeg|png|svg|webp)',
};

export { config, handler };
