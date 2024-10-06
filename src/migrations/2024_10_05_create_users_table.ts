// ./migrations/2024_10_05_create_users_table.ts
import { Role } from '@/common/constants';
import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
	return knex.schema.createTable('users', (table) => {
		table.increments('id').primary();
		table.string('firstName').notNullable().checkLength('>=', 2).checkLength('<=', 50);
		table.string('lastName').notNullable().checkLength('>=', 2).checkLength('<=', 50);
		table.string('username').notNullable().unique();
		table.string('phoneNumber').notNullable().unique().checkLength('>=', 10);
		table.string('email').notNullable().unique();
		table.string('walletBalance').defaultTo(0);
		table.uuid('walletAddress').defaultTo(knex.fn.uuid());
		table.string('password').notNullable().checkLength('>=', 8);
		table.enu('role', Object.values(Role)).defaultTo(Role.User);
		//table.string('emailVerificationToken');
		table.string('ipAddress');
		table.boolean('isDeleted').defaultTo(false);
		table.boolean('isSuspended').defaultTo(false);
		//table.boolean('isEmailVerified').defaultTo(false);
		table.timestamps(true, true); // Adds created_at and updated_at
	});
};

export const down = async (knex: Knex): Promise<void> => {
	return knex.schema.dropTable('users');
};
