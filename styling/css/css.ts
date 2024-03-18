import { debounce } from '$std/async/mod.ts';
import { basename, extname } from '$std/path/mod.ts';
import { relative, resolve } from '$std/path/mod.ts';
import { copy } from '$std/fs/mod.ts';
import browserslist from 'browserslist';
import { build as esbuild } from 'esbuild/mod.js';
import init, { browserslistToTargets, transform } from 'lightningcss';

/**
 * Base directory.
 */
const __dirname = resolve();

/**
 * Browser targets for CSS transformation (using LightningCSS).
 */
const targets = browserslistToTargets(
	browserslist(
		'>= 0.25%', //5%, last 2 versions, Firefox >= 102, Firefox ESR, not dead',
	),
);

/**
 * Entry point for building the CSS on the command-line interface. This is currently
 * unused, but kept for reference for future changes.
 */
// deno-lint-ignore no-unused-vars
async function main() {
	const builder = new CSSBuilder();
	await builder.build();

	console.log('updated css');
	console.log('watching for updates');

	await builder.watch();
}

/**
 * CSS build options.
 */
type CSSBuilderOptions = {
	/**
	 * Base path of the CSS rendering.
	 */
	basePath: string;
	/**
	 * File patterns to ignore.
	 */
	external: string[];
	/**
	 * CSS files to ignore.
	 */
	ignore: string[];
	/**
	 * Source list to render.
	 */
	sourceList: string[];
	/**
	 * Destination oath.
	 */
	outPath: string;
	/**
	 * Apply transformations with Lightning CSS.
	 *
	 * Warning: this does not work with all CSS due to parsing issues in the WebAssembly encoding,
	 * so this is not currently used.
	 */
	transform?: boolean;
	/**
	 * Media file types to copy into the destination folder. This is used to copy media such as images
	 * and fonts from a CSS project.
	 */
	artifactExtensions?: string[];
};

/**
 * Build manager for CSS projects.
 */
class CSSBuilder {
	/**
	 * Instance of the CSS builder.
	 */
	static #instance: CSSBuilder;

	/**
	 * Provides the singleton instance of the CSS builder.
	 *
	 * @returns An instance of the CSS builder.
	 */
	static instance(): CSSBuilder {
		if (!CSSBuilder.#instance) {
			CSSBuilder.#instance = new CSSBuilder(CSSBuilder.defaultOptions());
		}

		return CSSBuilder.#instance;
	}

	/**
	 * Generates a default set of options to be used for a project.
	 *
	 * @returns Default set of CSS options (`CSSBuilderOptions`).
	 */
	static defaultOptions(): CSSBuilderOptions {
		return {
			basePath: resolve('assets'),
			external: ['*.woff2'],
			ignore: [
				'styles/main_bundled.css',
			],
			sourceList: [
				'css/base.css',
				'css/components.css',
				'css/handheld.css',
				'css/screen.css',
			],
			outPath: '_styles/css/',
			transform: false,
			artifactExtensions: [
				'.png',
				'.jpg',
				'.jpeg',
				'.svg',
				'.gif',
			],
		};
	}

	/**
	 * Options for building CSS.
	 */
	readonly options: CSSBuilderOptions;

	/**
	 * Working path for the CSS build process.
	 */
	#workingPath = './';

	/**
	 * Instantiates a new `CSSBuilder` instance.
	 *
	 * @param options Optional set of options to be used when building. If none are provided then
	 * the default set are used.
	 */
	constructor(options?: CSSBuilderOptions) {
		this.options = options ? options : CSSBuilder.defaultOptions();
	}

	/**
	 * Builds the CSS styling for the several CSS inputs.
	 *
	 * @param entryPoints Entry points to build from.
	 */
	async buildStyles(entryPoints: string[]) {
		await entryPoints.forEach((path) => {
			this.buildStyle(resolve(this.#workingPath, basename(path)));
		});

		if (this.options.artifactExtensions) {
			await this.copyArtifacts(this.#workingPath);
		}
	}

	/**
	 * Builds the CSS stylign for a single CSS file, and any imports it has.
	 *
	 * @param path Path of the CSS file to start with.
	 */
	async buildStyle(path: string) {
		const fileName = basename(path, '.css');

		try {
			const sourceCSS = await Deno.readTextFile(path);

			const outputCSS = (this.options.transform === true)
				? await this.#transformStyle(path, sourceCSS)
				: sourceCSS;

			const outputDir = this.options.outPath;
			const outputPath = resolve(outputDir, `${fileName}.min.css`);

			try {
				await Deno.mkdir(outputDir, { recursive: true });
			} catch (error: unknown) {
				// deno-lint-ignore no-empty
				if (error instanceof Deno.errors.AlreadyExists) {}
				else {
					throw new Error(
						`error creating destination "${path}": ${error as string}`,
					);
				}
			}

			await Deno.writeTextFile(outputPath, outputCSS);
		} catch (error: unknown) {
			console.log(error as string);
			throw new Error(
				`error building styles for path ${path}: ${error as string}`,
			);
		}
	}

	/**
	 * Copies the artifacts from the source project into the destination.
	 *
	 * @param path Path where to search for artifacts.
	 */
	async copyArtifacts(path: string) {
		const directory = await Deno.readDir(path);

		for await (const subPath of directory) {
			if (
				(subPath.isFile) &&
				(this.options.artifactExtensions?.includes(
					extname(subPath.name),
				))
			) {
				copy(
					resolve(path, subPath.name),
					resolve(this.options.outPath, subPath.name),
					{
						overwrite: true,
					},
				);
			}
		}
	}

	/**
	 * Bundles the styles from the source CSS using esbuild.
	 */
	async bundleStyles() {
		try {
			await esbuild({
				absWorkingDir: resolve(this.options.basePath),
				entryPoints: this.options.sourceList,
				bundle: true,
				outdir: this.#workingPath,
				external: this.options.external,
				minifyWhitespace: true,
				loader: {
					'.png': 'file',
					'.jpg': 'copy',
					'.jpeg': 'file',
					'.svg': 'file',
					'.gif': 'file',
				},
			});
		} catch (error: unknown) {
			throw new Error(`error bundling styles: ${error as string}`);
		}
	}

	/**
	 * Builds the CSS at a given location.
	 *
	 * @param path Path of the CSS to begin building.
	 */
	async build(path?: string) {
		await init();
		this.#workingPath = await Deno.makeTempDir();

		if (!path) {
			// Initial push to generate all CSS.
			await this.#updateStyles(this.options.sourceList[0]);
		} else {
			await this.#updateStyles(path);
		}
	}

	/**
	 * Watches a directory for changes and then updates the styles when changes
	 * are made.
	 */
	async watch() {
		const watcher = Deno.watchFs([resolve(this.options.basePath, 'css')]);

		for await (const event of watcher) {
			const { paths } = event;
			paths.forEach((path) => {
				this.#debouncedUpdateStyles(path);
			});
		}
	}

	/**
	 * Transforms CSS using a given set of rules, using LightningCSS.
	 *
	 * @param path File to begin transforming.
	 * @param sourceCSS Source CSS to transform.
	 *
	 * @returns Transformed CSS.
	 */
	async #transformStyle(path: string, sourceCSS: string) {
		const { code: outputCSSBytes } = await transform({
			filename: path,
			code: new TextEncoder().encode(sourceCSS),
			minify: true,
			targets,
			errorRecovery: true,
		});

		const decoder = new TextDecoder();
		const outputCSS = decoder.decode(outputCSSBytes);

		return outputCSS;
	}

	/**
	 * Debounces the update of styles. In the event an update is called before
	 * this is complete, the secondary update does not run.
	 */
	#debouncedUpdateStyles = debounce(
		async (path: string) => {
			await this.#updateStyles(path);
		},
		200,
	);

	/**
	 * Updates the styles.
	 *
	 * @param path Entrypoint for the update.
	 */
	async #updateStyles(path: string) {
		const relativePath = relative(__dirname, path);

		if (!this.options.ignore.includes(relativePath)) {
			await this.bundleStyles();
			await this.buildStyles(this.options.sourceList);
		}
	}
}

//main();

export { CSSBuilder, type CSSBuilderOptions };
