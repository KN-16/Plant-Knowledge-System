import { Counter } from '../models/index.js';

const generateCustomId = async (modelName, prefix, transaction = null) => {
  const [counter] = await Counter.findOrCreate({
    where: { model_name: modelName },
    defaults: { seq: 0 },
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
  });

  await counter.reload({ transaction, lock: transaction?.LOCK.UPDATE });

  counter.seq += 1;
  await counter.save({ transaction });

  return `${prefix}-${String(counter.seq).padStart(5, '0')}`;
};

export default generateCustomId;