import path from 'path';
import fs, { promises as fsPromises } from 'fs';
import { Readable } from 'stream';

export class Downloader {
	private static readonly basePath: string = process.cwd();

	/**
	 * Save File
	 *
	 * @param dirName
	 * @param fileName
	 * @param fileStream
	 */
	public static async saveFile(
		dirName: string,
		fileName: string | null = null,
		fileStream: Readable,
	) {
		if (!fileName) return null;

		const targetDir = path.join(Downloader.basePath, `public/${dirName}`);
		const targetPath = path.join(targetDir, fileName);

		// Ensure the target directory exists (create it if it doesn't)
		await fsPromises.mkdir(targetDir, { recursive: true });

		await new Promise<void>((resolve, reject) => {
			const writer = fs.createWriteStream(targetPath);
			fileStream.pipe(writer);
			writer.on('finish', () => resolve());
			writer.on('error', reject);
		});

		return targetPath;
	}
}
