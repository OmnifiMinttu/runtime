import { basename, dirname, extname, resolve } from '$std/path/mod.ts';
import { Content } from './content.ts';
import { extract } from '$std/front_matter/any.ts';
import { ImageSourceMap, parseImageMap } from './image.ts';

/**
 * Content stamp used to reference cached content in-memory.
 */
type ContentStamp<ContentType> = { content: ContentType; refreshDate?: Date };

/**
 * A structure for a content manager implementation used to sub-catagorize content and manage
 * various sources.
 */
interface ContentManager<KeyType, ContentType> {
	/**
	 * List of content, wrapped in a content stamp and referenced with a unique key.
	 */
	get content(): Map<KeyType, ContentStamp<ContentType>>;
}

/**
 * Base implementation of a content manager (ContentManager) for handling various content for pages. This is
 * an abstract implementation and needs a complete implementation to work.
 *
 * See `PageManager` for a fully
 * working implementation for generic page content.
 */
abstract class BaseContentManager<KeyType, ContentType>
	implements ContentManager<KeyType, ContentType> {
	/**
	 * List of content. This is instantiated once and items are subsequently refreshed
	 * afterwards.
	 */
	readonly #content: Map<KeyType, ContentStamp<ContentType>>;

	/**
	 * List of paths to lookup for content.
	 */
	#contentPaths: string[];

	/**
	 * Instantiates a BaseContentManager instance with a given list of content paths.
	 *
	 * @param contentPaths List of paths (potentially relative) for loading the content.
	 */
	protected constructor(contentPaths: string[]) {
		this.#content = new Map<KeyType, ContentStamp<ContentType>>();
		this.#contentPaths = contentPaths;
	}

	/**
	 * Provides a readonly list of the content, wrapped in a content stamp.
	 */
	get content(): Map<KeyType, ContentStamp<ContentType>> {
		return this.#content;
	}

	/**
	 * Loads the content into the content list.
	 */
	protected async load() {
		await this.#contentPaths.forEach(async (path) => {
			const contentList = await this.getContentFromPath(path);

			await contentList.forEach((stamp, key) => {
				this.#content.set(key, stamp);
			});

			await this.loadDirectory(path);
		});
	}

	/**
	 * Loads content from a given directory.
	 *
	 * @param path Top-level path to begin loading.
	 */
	protected async loadDirectory(path: string) {
		const directory = await Deno.readDir(path);

		for await (const pathItem of directory) {
			if (pathItem.isDirectory) {
				const contentList = await this.getContentFromPath(
					resolve(path, pathItem.name),
				);

				await contentList.forEach((stamp, key) => {
					this.#content.set(key, stamp);
				});
			}
		}
	}

	/**
	 * Gets the content from a given path.
	 *
	 * Currently this handles markdown files only, and each markdown file requires a minimum
	 * front matter to work.
	 *
	 * @param path Path where the content should be loaded.
	 * @returns A map of content stamps.
	 */
	protected async getContentFromPath(
		path: string,
	): Promise<Map<KeyType, ContentStamp<ContentType>>> {
		const directoryContents = await Deno.readDir(path);

		const response: Map<KeyType, ContentStamp<ContentType>> = new Map();

		for await (const contentPath of directoryContents) {
			if ((contentPath.isFile) && (contentPath.name.endsWith('.md'))) {
				try {
					const { key, stamp } = await this.parseContent(
						resolve(path, contentPath.name),
					);

					response.set(key, stamp);
				} catch {
					console.error(
						`unable to parse content at ${contentPath.name}`,
					);
				}
			}
		}

		return response;
	}

	/**
	 * Overwrites the content paths in the content manager.
	 *
	 * @param paths Paths to use for searching content.
	 */
	protected setContentPaths(paths: string[]) {
		this.#contentPaths = paths;
	}

	/**
	 * Parses the content at a given path and loads it into a `Content` structure, then stamps it for
	 * the content map.
	 *
	 * @param path Path where the content should be parsed.
	 */
	// deno-lint-ignore require-await
	protected async parseContent(
		_path: string,
	): Promise<{ key: KeyType; stamp: ContentStamp<ContentType> }> {
		throw new Error('parserContent not implemented');
	}
}

/**
 * Manages generic page content from a given store.
 */
class PagesManager extends BaseContentManager<string, Content>
	implements ContentManager<string, Content> {
	/**
	 * Provides the singleton instance of the PagesManager for the application. If this has
	 * not been instantiated yet, it creates a new instance and returns that for the remaining
	 * lifecycle of the application.
	 *
	 * @returns The singleton instance of the PageManager.
	 */
	static get context(): PagesManager {
		if (!PagesManager.#context) {
			PagesManager.#context = new PagesManager();
		}

		return PagesManager.#context;
	}

	/**
	 * Fetches the pages for routing in the application.
	 *
	 * @returns A map of pages for given routes in the application.
	 */
	static async fetchPages(): Promise<Map<string, ContentStamp<Content>>> {
		if (PagesManager.context.content.size === 0) {
			PagesManager.context.setContentPaths(['./modules/content']);

			await PagesManager.context.load();
		}

		return PagesManager.context.content;
	}

	/**
	 * The singleton instance of the PageManager.
	 */
	static #context: PagesManager;

	/**
	 * Instantiates a new PageManager and loads the content from the 'content' data store
	 * using the DataManager. Page content is in the 'pages' subdirectory.
	 */
	private constructor() {
		super([]);
	}

	/**
	 * Enables a forced refresh of the page content.
	 */
	async refresh() {
		await this.load();
	}

	/**
	 * Parses the content at a given path from markdown.
	 *
	 * @param path Location of the markdown file.
	 * @returns A content stamp (`ContentStamp<Content>`) for a given route.
	 */
	protected async parseContent(
		path: string,
	): Promise<{ key: string; stamp: ContentStamp<Content> }> {
		const text = await Deno.readTextFile(path);

		const fileName = basename(path, extname(path));
		const folderName = basename(dirname(path));

		const { attrs, body } = extract(text);

		const slug = (fileName === 'index') ? folderName : fileName;

		const page = {
			slug: slug,
			feature: attrs.feature as boolean,
			title: attrs.title as string,
			publishedAt: new Date(attrs.published_at as string),
			body: body,
			snippet: attrs.snippet as string,
			draft: attrs.draft as boolean,
			summary: attrs.summary as string,
			images: await parseImageMap(attrs.images as ImageSourceMap),
			path: path,
		};

		return {
			key: slug,
			stamp: {
				content: page,
				refreshDate: new Date(),
			},
		};
	}
}

export {
	BaseContentManager,
	type ContentManager,
	type ContentStamp,
	PagesManager,
};
