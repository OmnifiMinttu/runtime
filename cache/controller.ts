import { FreshContext } from '$fresh/server.ts';
import EnvironmentMiddleware from '../environment/middleware.ts';
import SpritesCache from '../graphics/sprites.ts';
import State from '../state/state.ts';

/**
 * Provides the management layer for handling assets, including images, during the
 * application's execution.
 */
class AssetsController {
	/**
	 * The singleton instance of the assets controller. If this has not been instantiated
	 * yet it will be on the first request.
	 *
	 * @returns The instance of the assets controller.
	 */
	public static instance(): AssetsController {
		if (!AssetsController.#instance) {
			AssetsController.#instance = new AssetsController();
		}

		return AssetsController.#instance;
	}

	/**
	 * Sprites cache for handling sprite map / sheet assets.
	 */
	sprites = new SpritesCache();

	/**
	 * The singleton instance for the assets controller.
	 */
	static #instance: AssetsController;
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
): Promise<Response> {
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

export default AssetsController;

export { cacheControlHandler };
