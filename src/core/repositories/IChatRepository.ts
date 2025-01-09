import { Chat } from '../domain/models/Chat';

export interface IChatRepository {
  getByRoomId(roomId: string): Promise<Chat[]>;
  create(chat: Omit<Chat, 'id'>): Promise<Chat>;
  update(id: string, chat: Partial<Chat>): Promise<Chat>;
  delete(id: string): Promise<void>;
  addReaction(chatId: string, userId: string, emoji: string): Promise<Chat>;
  removeReaction(chatId: string, userId: string, emoji: string): Promise<Chat>;
} 