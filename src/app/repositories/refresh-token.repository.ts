import { Response } from 'express';
import {
	FindAttributeOptions,
	InferCreationAttributes,
	Transaction,
	WhereOptions,
} from 'sequelize';

import { Repository } from '@/shared/libs/repository.lib';
import { RefreshToken } from '@/app/models';

export class RefreshTokenRepository extends Repository {
	constructor() {
		super();
	}

	/**
	 * Find one record
	 *
	 * @param res
	 * @param where
	 * @param attributes
	 * @returns
	 */
	public async findOne(
		res: Response | null,
		where: WhereOptions<RefreshToken>,
		attributes: FindAttributeOptions | undefined = undefined,
	): Promise<RefreshToken | null> {
		let result: RefreshToken | null = null;

		try {
			result = await RefreshToken.findOne({
				where: {
					...where,
					deleted_at: null,
				},
				attributes,
			});
		} catch (error) {
			await this.catchErrorHandler(res, error, this.findOne.name);
		}
		return result;
	}

	/**
	 * Find one record by id
	 *
	 * @param res
	 * @param id
	 * @param attributes
	 * @returns
	 */
	public async findOneById(
		res: Response | null,
		id: number,
		attributes: FindAttributeOptions | undefined = undefined,
	): Promise<RefreshToken | null> {
		let result: RefreshToken | null = null;

		try {
			result = await this.findOne(res, { id }, attributes);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.findOneById.name);
		}
		return result;
	}

	/**
	 * Create record
	 *
	 * @param res
	 * @param payload
	 * @param transaction
	 * @returns
	 */
	public async create(
		res: Response,
		payload: InferCreationAttributes<RefreshToken>,
		transaction: Transaction | null = null,
	): Promise<RefreshToken | null> {
		let result: RefreshToken | null = null;

		try {
			result = await RefreshToken.create(payload, { transaction });
		} catch (error) {
			await this.catchErrorHandler(res, error, this.create.name);
		}
		return result;
	}

	/**
	 * Find all record
	 *
	 * @param res
	 * @param where
	 * @param attributes
	 * @returns
	 */
	public async findAll(
		res: Response | null,
		where: WhereOptions<RefreshToken>,
		attributes: FindAttributeOptions | undefined = undefined,
	): Promise<RefreshToken[]> {
		let result: RefreshToken[] = [];

		try {
			result = await RefreshToken.findAll({
				where: {
					...where,
				},
				attributes,
			});
		} catch (error) {
			await this.catchErrorHandler(res, error, this.findAll.name);
		}
		return result;
	}
}
