
/**
 * Options for setting the a header banner element.
 */
type HeaderProperties = {
	/**
	 * Logo for the header banner.
	 */
	logo: HeaderLogoProperties;

	/**
	 * Title of the header banner.
	 */
	title: string;
};

/**
 * Options for setting the logo of the header banner.
 */
interface HeaderLogoProperties {
	/**
	 * Location of the header logo as a relative href.
	 */
	href?: string,
	/**
	 * URL of the header logo as an absolute location.
	 */
    url?: URL,
	/**
	 * Content of the logo (e.g. the SVG body).
	 */
    content?: string,
	/**
	 * The dimensions of the logo.
	 */
    dimensions?: {
		/**
		 * The height of the image.
		 */
		height: number,
		/**
		 * The width of the image.
		 */
		width: number,
		/**
		 * The x-coordinate element of the image from the source.
		 */
        x?: number,
		/**
		 * The y-coordinate element of the image from the source.
		 */
        y?: number
    }
}

/**
 * Header component to set a banner within a page.
 * 
 * @param properties Options to configure the header banner.
 * @returns A header element from the given properties.
 */
function HeaderComponent(properties: HeaderProperties) {
	const { logo, title } = properties;

	const logoElement = HeaderLogoElement(logo);

	return (
		<header role='banner'>
			<div class='titlebar'>
				<span class='title'>{title}</span>
				{logoElement}
			</div>
		</header>
	);
}

function HeaderLogoElement(properties: HeaderLogoProperties) {
	if (properties.href) {
		const viewBox = {
			minX: (properties.dimensions?.x) ? properties.dimensions.x : 0,
			minY: (properties.dimensions?.y) ? properties.dimensions.y : 0,
			width: (properties.dimensions?.width) ? properties.dimensions.width: 1024,
			height: (properties.dimensions?.height) ? properties.dimensions.height: 1024
		}

		const viewBoxProperty = `${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`;

		return (
			<svg class='logo' viewBox={viewBoxProperty}>
				<use xlink:href={properties.href}></use>
			</svg>
		)
	}

	return (<></>)
}

export {
	HeaderComponent,
	type HeaderLogoProperties,
	type HeaderProperties
}

export default HeaderComponent;