/**
 * Language (from ISO 639).
 */
type Language = string;

/**
 * Stamp for the cache. Includes the entity (value) and is used for maintaining a healthy cache.
 */
interface CacheStamp<Entity = unknown> {
	/**
	 * Hash of the item.
	 */
	hash?: string;
	/**
	 * Version of the item.
	 */
	version?: string;
	/**
	 * Time when item was stamped.
	 */
	stampedAt: Date;
	/**
	 * When the item should expire. This provides no guarantees.
	 */
	expiry: Date;
	/**
	 * Language of the item following ISO 639.
	 */
	language: Language;
	/**
	 * Value of the item.
	 */
	value: Entity;
}

/**
 * Cache dictionary.
 */
type Cache = { [path: string]: CacheStamp };

export { type Cache, type CacheStamp, type Language };
