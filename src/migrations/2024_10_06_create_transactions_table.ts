import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
	return knex.schema.createTable('transactions', (table) => {
		table.increments('id').primary(); 
		table.integer('senderId').unsigned().notNullable();
		table.integer('receiverId').unsigned().notNullable();
		table.string('walletAddress').nullable(); 
		table.decimal('amount', 14, 2).notNullable();
		table.string('transactionType').notNullable(); 
		table.string('status').defaultTo('pending'); 
		table.string('transactionReference').unique().notNullable(); 
		table.timestamps(true, true);

		// Foreign keys
		table.foreign('senderId').references('id').inTable('users').onDelete('CASCADE');
		table.foreign('receiverId').references('id').inTable('users').onDelete('CASCADE');
	});
};

export const down = async (knex: Knex): Promise<void> => {
	return knex.schema.dropTable('transactions');
};
