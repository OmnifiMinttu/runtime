import SpritesCache from '../graphics/sprites.ts';

/**
 * Structure for the assets cache.
 */
interface AssetsCache {
	/**
	 * Sprites cache, typically used for handling the sprite sheets to be rendered inline.
	 */
	sprites?: SpritesCache;
}

export default AssetsCache;
