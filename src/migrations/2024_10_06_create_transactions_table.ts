import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
	return knex.schema.createTable('transactions', (table) => {
		table.increments('id').primary(); // Auto-incrementing ID
		table.integer('senderId').unsigned().notNullable(); // ID of the sender
		table.integer('receiverId').unsigned().notNullable(); // ID of the receiver
		table.string('walletAddress').nullable(); // Wallet address for external transfers
		table.decimal('amount', 14, 2).notNullable(); // Amount of the transaction
		table.string('transactionType').notNullable(); // Transaction type (e.g. 'transfer', 'withdrawal', 'deposit')
		table.string('status').defaultTo('pending'); // Transaction status (e.g. 'pending', 'completed', 'failed')
		table.string('transactionReference').unique().notNullable(); // Unique reference ID
		table.timestamps(true, true);

		// Foreign keys
		table.foreign('senderId').references('id').inTable('users').onDelete('CASCADE');
		table.foreign('receiverId').references('id').inTable('users').onDelete('CASCADE');
	});
};

export const down = async (knex: Knex): Promise<void> => {
	return knex.schema.dropTable('transactions');
};
