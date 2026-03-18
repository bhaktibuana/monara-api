import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';

import { Constant } from '@/shared/constants';
import { T_JWTPayload } from '@/shared/types';
import { Config } from '@/config';
import {
	I_MysqlRelationCheck,
	I_Pagination,
	I_VerifiedJWT,
} from '@/shared/interfaces';
import { fkMetadata } from '@/app/models/fk-metadata';
import { Op } from 'sequelize';
import dayjs from 'dayjs';
import UAParser from 'ua-parser-js';

export class Helper {
	/**
	 * Sleep the program
	 *
	 * @param ms
	 * @returns
	 */
	public static async sleep(ms: number): Promise<unknown> {
		return await new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Hash String
	 *
	 * @param str
	 * @returns
	 */
	public static hash(str: string): string {
		return crypto
			.createHmac('sha256', Constant.app.HASH_SALT)
			.update(str)
			.digest('hex');
	}

	/**
	 * Generate JWT
	 *
	 * @param payload
	 * @param expiresIn
	 * @returns
	 */
	public static generateJWT(
		payload: T_JWTPayload,
		expiresIn?: SignOptions['expiresIn'],
	): string {
		return expiresIn
			? jwt.sign(payload, Config.app.JWT_SECRET_KEY, {
					algorithm: 'HS256',
					expiresIn,
				} as SignOptions)
			: jwt.sign(payload, Config.app.JWT_SECRET_KEY, {
					algorithm: 'HS256',
				} as SignOptions);
	}

	/**
	 * Verify JWT
	 *
	 * @param token
	 * @returns
	 */
	public static verifyJWT<T>(token: string): I_VerifiedJWT<T> {
		let error: I_VerifiedJWT<T>['error'] = null;
		let decoded: I_VerifiedJWT<T>['decoded'] = {};

		jwt.verify(
			token,
			Config.app.JWT_SECRET_KEY,
			{ algorithms: ['HS256'] },
			(err, dec) => {
				error = err;
				decoded = dec as I_VerifiedJWT<T>['decoded'];
			},
		);
		return { error, decoded };
	}

	/**
	 * Generate Pagination
	 *
	 * @param page
	 * @param perPage
	 * @param count
	 * @returns
	 */
	public static generatePagination(
		page: number,
		perPage: number,
		count: number,
	): I_Pagination | null {
		const totalPage = count > 0 ? Math.ceil(count / perPage) : 0;
		const previousPage = page - 1 <= 0 ? null : page - 1;
		const nextPage = page + 1 > totalPage ? null : page + 1;

		return {
			current_page: page,
			previous_page: previousPage,
			next_page: nextPage,
			per_page: perPage,
			total_pages: totalPage,
			total_items: count,
		} as I_Pagination;
	}

	/**
	 * MySQL Relation (FK) Checker
	 *
	 * Desc:
	 * This function is used to check is record data has been used by orther data or not.
	 *
	 * @param fkMetadataKey
	 * @param id
	 * @returns
	 */
	public static async mysqlRelationCheck(
		fkMetadataKey: keyof typeof fkMetadata,
		id: number,
	) {
		const checkOutput: I_MysqlRelationCheck = {
			total_records: 0,
			records: [],
		};

		const foreignKeys = Object.values(
			fkMetadata[fkMetadataKey].reduce(
				(acc, curr) => {
					const key = `${curr.table}_${curr.model.name}`;
					if (!acc[key]) {
						acc[key] = {
							table: curr.table,
							model: curr.model,
							columns: [],
						};
					}
					acc[key].columns.push(curr.column);
					return acc;
				},
				{} as Record<
					string,
					{ table: string; model: any; columns: string[] }
				>,
			),
		);

		for (const fk of foreignKeys) {
			const { table, model, columns } = fk;

			const where = {
				[Op.or]: columns.map((col) => ({
					[col]: id,
				})),
				deleted_at: null,
			};

			const count = await model.count({ where });
			checkOutput.total_records += count;
			checkOutput.records.push({
				table_name: table,
				count,
			});
		}

		return checkOutput;
	}

	/**
	 * Generate Data Code
	 *
	 * @param prefix
	 * @param id
	 * @returns
	 */
	public static generateDataCode(prefix: string, id: number) {
		const datePart = dayjs().format('YYMM');
		const idFormatted = id.toString().padStart(4, '0');
		return `${prefix}-PB-${datePart}${idFormatted}`;
	}
	
	/**
	 * Get Device Info from User Agent
	 * 
	 * @param userAgent
	 */
	public static getDeviceInfo(userAgent: string) {
		const parser = new (UAParser as any)(userAgent);
		const ua = parser.getResult();

		return {
			browser: ua.browser.name,
			os: ua.os.name,
			device: ua.device.type || 'desktop',
			raw: userAgent,
		};
	}
}
