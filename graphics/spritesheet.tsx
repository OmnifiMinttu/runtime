import AssetsMiddleware from '../cache/middleware.ts';
import SpritesCache from './sprites.ts';

/**
 * Spritesheet component (`<div />` with inline SVG content and the class name of "spritesheet").
 * 
 * @returns HTML element (`<div />` with a class of "spritesheet").
 */
function Spritesheet() {
	return (
		<div
			class='spritesheet'
			dangerouslySetInnerHTML={{ __html: SpritesCache.content }}
		/>
	);
}

/**
 * Assets cache which contains the sprite cache.
 */
const cache = AssetsMiddleware.instance();
await cache.sprites.build();

export default Spritesheet;

export {
	Spritesheet
}