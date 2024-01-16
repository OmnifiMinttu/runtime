import { DOMParser } from 'deno-dom/deno-dom-wasm.ts';
import { AssetState } from '../state/assets.ts';

/**
 * Sprite for use in embedded spritemaps.
 */
interface Sprite {
	/**
	 * URL of the sprite.
	 */
	url?: URL;
	/**
	 * Body of the sprite (e.g. SVG XML).
	 */
	content?: string;
	/**
	 * Hash of the sprite used to determine whether unique and up-to-date.
	 */
	hash?: string;
}

/**
 * Manages the cache for sprites within the application.
 */
class SpritesCache {
	/**
	 * Compiled spritesheet for the application (SVG XML).
	 */
	static content = '';

	/**
	 * Provides singleton instance of the sprite cache.
	 *
	 * @returns
	 */
	static instance() {
		if (!this.#instance) {
			this.#instance = new SpritesCache();
		}

		return this.#instance;
	}

	/**
	 * Builds a spritesheet from the list of sprites available.
	 *
	 * @returns Compiled spritesheet.
	 */
	// deno-lint-ignore require-await
	async build(): Promise<string> {
		SpritesCache.content = '';

		this.#list.forEach((sprite) => {
			if (sprite.content) {
				this.appendContent(sprite.content);
			}
		});

		return SpritesCache.content;
	}

	/**
	 * Singleton instance of the sprite cache.
	 */
	static #instance: SpritesCache;

	/**
	 * Appends a new sprite from a given URL into the sprite cache.
	 *
	 * @param url URL of the sprite (SVG) to append.
	 */
	async appendFromURL(url: URL) {
		const fetchResponse = await fetch(url);
		const svgContent = await fetchResponse.text();

		const document = new DOMParser().parseFromString(
			svgContent,
			'text/html',
		);

		let spriteContent = '';

		if (document) {
			const elements = document.getElementsByTagName('svg');

			elements.forEach((element) => {
				spriteContent = spriteContent + element.outerHTML;
			});

			const hash = await AssetState.hashString(spriteContent);

			const sprite: Sprite = {
				url: url,
				content: spriteContent,
				hash: hash,
			};

			this.#list.push(sprite);
		}

		this.build();
	}

	/**
	 * Appends a sprite to the sprite cache from the content (SVG XML).
	 *
	 * @param content SVG XML of the sprite to append.
	 *
	 * @returns New spritesheet with appended sprite.
	 */
	appendContent(content: string): string {
		SpritesCache.content += content;

		return SpritesCache.content;
	}

	/**
	 * Append an SVG sprite from a local file.
	 *
	 * @param path Path where the SVG is located.
	 *
	 * @returns Updated spritesheet with new SVG appended.
	 */
	async appendSVGFromFile(path: string): Promise<string> {
		const svgContent = await this.svgFromFile(path);
		this.appendContent(svgContent);

		return SpritesCache.content;
	}

	/**
	 * Loads an SVG's contents from a given path.
	 *
	 * @param path Path where the SVG can be found.
	 *
	 * @returns The body of the SVG file.
	 */
	async svgFromFile(path: string): Promise<string> {
		const svgResponse = await fetch(new URL(path, import.meta.url));
		const svgContent = await svgResponse.text();

		const document = new DOMParser().parseFromString(
			svgContent,
			'text/html',
		);

		let response = '';

		if (document) {
			const elements = document.getElementsByTagName('svg');

			elements.forEach((element) => {
				response = response + element.outerHTML;
			});
		}

		return response;
	}

	/**
	 * List of sprites available to compile.
	 */
	#list: Sprite[] = Array<Sprite>();
}

export default SpritesCache;
