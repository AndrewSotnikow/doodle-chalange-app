import {
  Message,
  MessageInternal,
  CreateMessageBody,
} from '../../types/types.js';
import { messagesRepository } from './messages.repository.js';

const transformMessage = (message: MessageInternal): Message => ({
  _id: message._id,
  message: message.message,
  author: message.author,
  createdAt: message.createdAt.toISOString(),
});

const messagesService = {
  async createMessage(data: CreateMessageBody): Promise<Message> {
    const messageDoc = await messagesRepository.createMessage(data);

    return transformMessage(messageDoc);
  },

  async getMessages({
    sortOrder = -1,
    limit,
    after,
    before,
  }: {
    sortOrder: 1 | -1;
    limit: number;
    after: string | undefined;
    before: string | undefined;
  }): Promise<Message[]> {
    const messages = await messagesRepository
      .getMessages({
        sortOrder,
        limit,
        after,
        before,
      })
      .then((items) => items.map(transformMessage));

    return messages;
  },
};

export { messagesService };
