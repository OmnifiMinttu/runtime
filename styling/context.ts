import { FontsCache } from './fonts/fonts.ts';
import { StylesCache } from './css/styles.ts';

/**
 * Handles the styling logic for the application, including caching styling
 * assets such as CSS and fonts.
 */
class StylingContext {
	/**
	 * Provides a singleton instance of the styling middleware.
	 *
	 * @returns Singleton instance of the styling middleware.
	 */
	static instance() {
		if (!StylingContext.#context) {
			StylingContext.#context = new StylingContext();
		}

		return StylingContext.#context;
	}

	/**
	 * Instance of the styling middleware.
	 */
	static #context: StylingContext;

	/**
	 * Fonts cache.
	 */
	fonts = new FontsCache();

	/**
	 * CSS cache.
	 */
	styles = new StylesCache();
}

export default StylingContext;
