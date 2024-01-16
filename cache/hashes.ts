/**
 * Hash storage structure. This is used to ensure hashes are not re-computed
 * each time a request is made.
 */
interface Hashes {
	/**
	 * List of hashes with a given key (often the URL of the resource).
	 */
	[key: string]: string;
}

export default Hashes;
