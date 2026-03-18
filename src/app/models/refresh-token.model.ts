import {
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize,
} from 'sequelize';

import { MySQL } from '@/shared/utils';
import { User } from '@/app/models/user.model';

export class RefreshToken extends Model<
	InferAttributes<RefreshToken>,
	InferCreationAttributes<RefreshToken>
> {
	public id?: number;
	public created_at?: Date;
	public updated_at?: Date;
	public deleted_at?: Date | null;
	public user_id!: number;
	public token!: string;
	public iat_at!: Date;
	public exp_at!: Date;
	public is_active!: boolean;

	public static associate() {
		RefreshToken.belongsTo(User, {
			as: 'refresh_token_user',
			foreignKey: 'user_id',
		});
	}
}

RefreshToken.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('NOW()'),
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: Sequelize.literal('NOW()'),
		},
		deleted_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		token: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		iat_at: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		exp_at: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	},
	{
		tableName: 'refresh_tokens',
		freezeTableName: false,
		timestamps: false,
		sequelize: MySQL.getMainDbConnection(),
	},
);
