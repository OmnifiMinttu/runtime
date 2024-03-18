/**
 * Web manifest in-memory representation.
 */
interface WebManifest {
	/**
	 * Name of the application.
	 */
	name: string;
	/**
	 * Short name for the application.
	 */
	short_name: string;
	/**
	 * Initial URL for the application entrypoint.
	 */
	start_url: string;
	/**
	 * Display mode for the application.
	 */
	display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
	/**
	 * Description of the application.
	 */
	description: string;
	/**
	 * List of icons for the application.
	 */
	icons: WebManifestIcon[];
}

/**
 * Web manifest icon in-memory representation.
 */
type WebManifestIcon = {
	/**
	 * Location of the icon relative to the root.
	 */
	src: string;
	/**
	 * Sizes of the icon.
	 */
	sizes: string;
	/**
	 * Type of icon source.
	 */
	type: 'image/png' | 'image/webp' | 'image/jpg' | 'image/svg+xml';
};

export { type WebManifest, type WebManifestIcon };
