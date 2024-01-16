import { FreshContext } from '$fresh/server.ts';
import EnvironmentMiddleware from '../environment/middleware.ts';
import SpritesCache from '../graphics/sprites.ts';
import State from '../state/state.ts';

/**
 * Provides the management layer for handling assets, including images, during the
 * application's execution.
 */
class AssetsMiddleware {
	/**
	 * The singleton instance of the assets middleware. If this has not been instantiated
	 * yet it will be on the first request.
	 *
	 * @returns The instance of the assets middleware.
	 */
	public static instance() {
		if (!AssetsMiddleware.#instance) {
			AssetsMiddleware.#instance = new AssetsMiddleware();
		}

		return AssetsMiddleware.#instance;
	}

	/**
	 * Sprites cache for handling sprite map / sheet assets.
	 */
	sprites = new SpritesCache();

	/**
	 * The singleton instance for the assets middleware.
	 */
	static #instance: AssetsMiddleware;
}

/**
 * Handler for setting the cache control on various assets.
 *
 * @param _request HTTP request object.
 * @param context Fresh context.
 * @returns HTTP response object.
 */
async function cacheControlHandler(
	_request: Request,
	context: FreshContext<State>,
) {
	context.state.environment = EnvironmentMiddleware.instance();

	if (context.destination === 'route') {
		const response = await context.next();
		return response;
	}

	const response = await context.next();
	const headers = response.headers;
	headers.set('Cache-Control', 'max-age=604800');

	return response;
}

export default AssetsMiddleware;

export { cacheControlHandler };
