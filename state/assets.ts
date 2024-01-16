import { encodeHex } from '$std/encoding/hex.ts';
import Hashes from '../cache/hashes.ts';

/**
 * Algorithm for hash digests.
 */
const digestAlgorithmIdentifier = 'SHA-256';

/**
 * Asset state manages the in-memory caching of assets.
 */
class AssetState {
	/**
	 * List of hashes in-memory.
	 */
	static #hashes: Hashes = {};

	/**
	 * Generates an "integrity" attribute property for an asset.
	 * 
	 * @param path Path where the asset should be found, within the "static" folder of the application.
	 * 
	 * @returns The integrity reference (hash) of the asset.
	 */
	static integrity(path: string): string {
		if (AssetState.#hashes == undefined) {
			AssetState.#hashes = {};
		}

		const fileContents = Deno.readFileSync(`static/${path}`);
		const decodedContents = new TextDecoder().decode(fileContents);

		if (AssetState.#hashes[path] == undefined) {
			AssetState.hashString(decodedContents).then((response) => {
				AssetState.#hashes[path] = response;
				return response;
			});

			return AssetState.#hashes[path];
		}

		return AssetState.#hashes[path];
	}

	/**
	 * Hashes a string.
	 * 
	 * @param content Content to hash.
	 * 
	 * @returns Hash of the content.
	 */
	static async hashString(content: string): Promise<string> {
		const encoded = new TextEncoder().encode(content);

		const fileHashBuffer = await crypto.subtle.digest(
			digestAlgorithmIdentifier,
			encoded,
		);
		const array = new Uint8Array(fileHashBuffer);
		const fileHash = encodeHex(array);

		return fileHash;
	}
}

export { AssetState };
