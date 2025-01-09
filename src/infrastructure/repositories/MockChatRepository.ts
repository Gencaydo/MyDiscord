import { IChatRepository } from '@/core/repositories/IChatRepository';
import { Chat } from '@/core/domain/models/Chat';

export class MockChatRepository implements IChatRepository {
  private chats: Chat[] = [];

  async getByRoomId(roomId: string): Promise<Chat[]> {
    return this.chats.filter(chat => chat.room.id === roomId);
  }

  async create(chat: Omit<Chat, 'id'>): Promise<Chat> {
    const newChat = {
      id: Math.random().toString(36).substr(2, 9),
      ...chat,
    };
    this.chats.push(newChat);
    return newChat;
  }

  async update(id: string, chat: Partial<Chat>): Promise<Chat> {
    const index = this.chats.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Chat not found');
    
    this.chats[index] = { ...this.chats[index], ...chat };
    return this.chats[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.chats.findIndex(c => c.id === id);
    if (index !== -1) {
      this.chats.splice(index, 1);
    }
  }

  async addReaction(chatId: string, userId: string, emoji: string): Promise<Chat> {
    const chat = this.chats.find(c => c.id === chatId);
    if (!chat) throw new Error('Chat not found');

    if (!chat.reactions) chat.reactions = [];
    const reaction = chat.reactions.find(r => r.emoji === emoji);
    
    if (reaction) {
      if (!reaction.users.find(u => u.id === userId)) {
        reaction.users.push({ id: userId } as any);
      }
    } else {
      chat.reactions.push({ emoji, users: [{ id: userId } as any] });
    }

    return chat;
  }

  async removeReaction(chatId: string, userId: string, emoji: string): Promise<Chat> {
    const chat = this.chats.find(c => c.id === chatId);
    if (!chat) throw new Error('Chat not found');

    if (chat.reactions) {
      const reactionIndex = chat.reactions.findIndex(r => r.emoji === emoji);
      if (reactionIndex !== -1) {
        chat.reactions[reactionIndex].users = chat.reactions[reactionIndex].users.filter(u => u.id !== userId);
        if (chat.reactions[reactionIndex].users.length === 0) {
          chat.reactions.splice(reactionIndex, 1);
        }
      }
    }

    return chat;
  }
} 