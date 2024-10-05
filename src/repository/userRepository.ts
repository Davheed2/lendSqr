import { knexDb } from '@/common/config';
import { IUser } from '@/common/interfaces';

class UserRepository {
  create = async (payload: Partial<IUser>) => {
    return await knexDb.table("users").insert(payload);
  };

  findById = async (id: number) => {
    return await knexDb.table("users").where({ id }).first();
  };

  findByUsername = async (username: string) => {
    return await knexDb.table("users").where({ username }).first();
  };

  findByEmail = async (email: string) => {
    return await knexDb.table("users").where({ email }).first();
  };

  update = async (id: number, payload: IUser) => {
    return await knexDb.table("users").where({ id }).update(payload);
  };

  delete = async (id: number) => {
    return await knexDb.table("users").where({ id }).del();
  };

  transferMoneyToUser = async (senderId: number, receiverId: number, amount: number) => {
  return knexDb.transaction(async (trx) => {
    const [sender, receiver] = await Promise.all([
      trx("users").where({ id: senderId }).first(),
      trx("users").where({ id: receiverId }).first(),
    ]);

    if (!sender) {
      throw new Error("Sender not found");
    }

    if (!receiver) {
      throw new Error("Receiver not found");
    }

    const senderBalance = parseFloat(sender.balance);
    const receiverBalance = parseFloat(receiver.balance);

    if (senderBalance < amount) {
      throw new Error("Insufficient balance");
    }

    await trx("users").where({ id: senderId }).update({ balance: senderBalance - amount });
    await trx("users").where({ id: receiverId }).update({ balance: receiverBalance + amount });
  });
}
}

export const userRepository = new UserRepository();