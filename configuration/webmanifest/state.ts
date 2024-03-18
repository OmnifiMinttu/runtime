import { resolve } from '$std/path/mod.ts';
import { ConfigurationStore } from '../store.ts';
import { WebManifest } from './webmanifest.ts';

/**
 * Web manifest stamp for caching.
 */
type WebManifestStamp = { path?: string; manifest: WebManifest; expiry?: Date };

/**
 * Web manifest in-memory cache.
 */
type WebManifestCache = Map<string, WebManifestStamp>;

/**
 * Web manifest state containing the current in-memory cache.
 */
class WebManifestState {
	/**
	 * Fetches the web manifest for a given language (ISO 639).
	 *
	 * @param language Language (ISO 639).
	 * @returns WebManifest or undefined if a web manifest could not be found.
	 */
	static async fetchWebManifest(
		language?: string,
	): Promise<WebManifest | undefined> {
		if (
			(!WebManifestState.#cache) || (WebManifestState.#cache.size === 0)
		) {
			await WebManifestState.#loadWebManifests();
		}

		if (language) {
			const manifest = WebManifestState.#cache.get(language);

			if (manifest) {
				return manifest.manifest;
			}
		}

		const manifest = WebManifestState.#cache.get('');

		return manifest?.manifest;
	}

	static #cache: WebManifestCache;

	static async #loadWebManifests() {
		WebManifestState.#cache = new Map();

		const manifestPath = resolve(
			ConfigurationStore.context.path,
			'manifest',
		); //import.meta.url);

		const regExp =
			'^(?<name>[A-Za-z0-9-_]*)\.(?<language>[A-Za-z0-9-]*)\.?webmanifest$';
		const manifestRegExp = new RegExp(regExp);
		const manifestDirectory = await Deno.readDir(manifestPath);

		for await (const item of manifestDirectory) {
			if (item.isFile) {
				const regExpResult = manifestRegExp.exec(item.name);
				const language = (regExpResult?.groups?.language)
					? `${regExpResult?.groups?.size}x${regExpResult?.groups?.size}`
					: undefined;

				WebManifestState.#cache.set(language ?? '', {
					manifest: await WebManifestState.#loadWebManifest(
						resolve(manifestPath, item.name),
					),
				});
			}
		}
	}

	/**
	 * Loads the web manifest and uses it to provide sensible defaults for the application.
	 *
	 * @param path Path of the web manifest file.
	 */
	static async #loadWebManifest(path: string) {
		const manifestURL = new URL(path, Deno.mainModule);
		const manifestFetchResponse = await fetch(manifestURL);
		const webManifest = await manifestFetchResponse.json() as WebManifest;

		return webManifest;
	}
}

export default WebManifestState;

export { WebManifestState };
