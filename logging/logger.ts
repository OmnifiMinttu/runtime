/**
 * Re-usable logger for consistent logging handling throughout an application.
 */
class Logger {
	/**
	 * Logs data at the info(rmation) level.
	 * @param data Data to log.
	 */
	static info(...data: unknown[]) {
		console.info(...data);
	}

	/**
	 * Logs data at the info(rmation) level.
	 * @param data Data to log.
	 */
	static log(...data: unknown[]) {
		console.log(...data);
	}

	/**
	 * Logs data at the error level.
	 * @param data Data to log.
	 */
	static error(...data: unknown[]) {
		console.error(...data);
	}

	/**
	 * Logs data at the debug level.
	 * @param data Data to log.
	 */
	static debug(...data: unknown[]) {
		console.debug(...data);
	}
}

export default Logger;

export { Logger };
