'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('refresh_tokens', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()'),
			},
			deleted_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
				onDelete: 'CASCADE',
			},
			token: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			iat_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			exp_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			is_active: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('refresh_tokens');
	},
};
