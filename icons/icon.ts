/**
 * Descriptor for various icon types in meta information.
 */
type WebIconDescriptor = 'favicon' | 'mask-icon' | 'icon' | 'apple-touch-icon';

/**
 * Icon structure.
 */
interface Icon {
	/**
	 * Color of icon, used for maskable icons.
	 */
	color?: string;
	/**
	 * Descriptor of icon for meta information.
	 */
	descriptor: WebIconDescriptor;
	/**
	 * Sizes of icon (useful for raster icons).
	 */
	sizes?: string;
	/**
	 * Type of icon (as in MIME type).
	 */
	type?: string;
	/**
	 * href of icon.
	 */
	href: string;
}

/**
 * Set if icons.
 */
type IconSet = Map<string, Icon>;

export { type Icon, type IconSet, type WebIconDescriptor };
