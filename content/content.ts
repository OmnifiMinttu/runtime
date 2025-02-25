import Image from './image.ts';

/**
 * Base page content structure.
 */
interface Content {
	/**
	 * Title of the page.
	 */
	title: string;
	/**
	 * Flag determining whether this page is a feature of the site.
	 *
	 * This can be used to filter content that should be highlighted on the home page,
	 * or some other reference.
	 */
	feature: boolean;
	/**
	 * Flag determining whether this page is a draft, or complete for publishing.
	 */
	draft: boolean;
	/**
	 * Path for the page.
	 */
	path?: string;
	/**
	 * Slug for the page. This can act as a unique key for sub-catagory of pages, and is
	 * by default used as the final element of the URL pattern.
	 */
	slug?: string;
	/**
	 * Date when the content was published. If this is in the future it can determine that the content
	 * should not be presented and is therefore also a draft (whether or not the draft flag is set).
	 */
	publishedAt?: Date;
	/**
	 * Body of the content.
	 */
	body: string;
	/**
	 * Snippet to be presented in cards for the content.
	 */
	//snippet?: string;
	/**
	 * Summary of the page to be presented in cards listing the page content.
	 */
	summary: string;
	/**
	 * List of images used in the page for feature listings and social posts.
	 */
	images?: Map<string, Image>;
}

/**
 * Create a simplified content structure.
 *
 * @param slug Slug (last component of the URL) for the content.
 * @param body Body of the content.
 * @returns
 */
const BasicContent = (slug: string, body: string): Content => {
	return {
		title: '',
		feature: false,
		draft: false,
		body: body,
		slug: slug,
		summary: '',
	};
};

export { BasicContent, type Content };
