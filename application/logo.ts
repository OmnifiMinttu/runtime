/**
 * Main application logo.
 */
interface ApplicationLogo {
	/**
	 * Href of the logo (if local and relative).
	 */
	href?: string;
	/**
	 * URL of the logo.
	 */
	url?: URL;
	/**
	 * Body of the logo content.
	 */
	content?: string;
	/**
	 * Dimensions of the logo.
	 */
	dimensions?: {
		/**
		 * X coordinate to start with (for SVGs).
		 */
		x?: number;
		/**
		 * Y coordinate to start with (for SVGs).
		 */
		y?: number;
		/**
		 * Width of the logo.
		 */
		width: number;
		/**
		 * Height of hte logo.
		 */
		height: number;
	};
}

export default ApplicationLogo;
