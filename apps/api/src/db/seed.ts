import { MessageModel } from '../models/message.model.js';
import { INITIAL_MESSAGES } from '../data/messages.js';

export const seedDatabase = async (): Promise<void> => {
  try {
    const count = await MessageModel.countDocuments();

    if (count === 0) {
      await MessageModel.insertMany(INITIAL_MESSAGES);
      console.log('💬 Initial messages seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};
