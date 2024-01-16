/**
 * Structure for a social graph (OpenGraph) representation.
 */
type MetaGraphProperties = {
	/**
	 * URL for the graph node (page).
	 */
	url: URL;
	/**
	 * Title of the graph node (page).
	 */
	title: string;
	/**
	 * Description of the graph node (page).
	 */
	description: string;
	/**
	 * Image for the graph node (page).
	 */
	image?: string;
};

/**
 * A social graph component for the meta properties in the head section of a page.
 *
 * @param properties Meta graph properties to configure the head section.
 * @returns Meta properties for the head section of a page.
 */
function MetaGraphComponent(properties: MetaGraphProperties) {
	const { description, image, title, url } = properties;

	return (
		<>
			{/* Facebook Meta Tags */}
			<meta property='og:url' content={url.href} />
			<meta property='og:type' content='website' />
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			{image && <meta property='og:image' content={image} />}

			{/* Twitter Meta Tags */}
			<meta name='twitter:card' content='summary_large_image' />
			<meta property='twitter:domain' content={url.hostname} />
			<meta property='twitter:url' content={url.href} />
			<meta name='twitter:title' content={title} />
			<meta name='twitter:description' content={description} />
			{image && <meta name='twitter:image' content={image} />}
		</>
	);
}

export { MetaGraphComponent, type MetaGraphProperties };
