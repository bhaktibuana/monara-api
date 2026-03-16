import mongoose, { Connection } from 'mongoose';
import { Console } from '@/shared/utils/console.util';

export class Mongo {
	private static mainDbConnection: Connection;
	private static utilityDbConnection: Connection;

	/**
	 * Connect to utility_db for SystemLog model
	 *
	 * @param dbDsn
	 * @param dbName
	 */
	public static async connectUtilityDb(
		dbDsn: string,
		dbName: string,
	): Promise<void> {
		try {
			Mongo.utilityDbConnection = mongoose.createConnection(dbDsn, {
				dbName,
			});
			Console.info(
				`Successfully connected to mongo utility database (${dbName})`,
			);
		} catch (error) {
			Console.error(error);
			process.exit(1);
		}
	}

	/**
	 * Connect to putra_buana_erp_db
	 *
	 * @param dbDsn
	 * @param dbName
	 */
	public static async connectMainDb(
		dbDsn: string,
		dbName: string,
	): Promise<void> {
		try {
			Mongo.mainDbConnection = mongoose.createConnection(dbDsn, {
				dbName,
			});
			Console.info(
				`Successfully connected to mongo main database (${dbName})`,
			);
		} catch (error) {
			Console.error(error);
			process.exit(1);
		}
	}

	/**
	 * Get the utility_db connection instance
	 *
	 * @returns
	 */
	public static getUtilityDbConnection(): Connection {
		return Mongo.utilityDbConnection;
	}

	/**
	 * Get the putra_buana_erp_db connection instance
	 *
	 * @returns
	 */
	public static getMainDbConnection(): Connection {
		return Mongo.mainDbConnection;
	}

	/**
	 * Disconnect all connections
	 */
	public static async disconnectAll(): Promise<void> {
		await Promise.all([Mongo.utilityDbConnection?.close()]);
		Console.info('All MongoDB connections disconnected.');
	}
}
