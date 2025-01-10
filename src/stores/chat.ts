import { defineStore } from 'pinia';
import { User } from '@/core/domain/models/User';

interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: Date;
}

interface ChatState {
  messages: Record<string, Message[]>;
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: {}
  }),

  getters: {
    getMessages: (state) => (friendId: string) => {
      return state.messages[friendId] || [];
    }
  },

  actions: {
    addMessage(friendId: string, message: Message) {
      if (!this.messages[friendId]) {
        this.messages[friendId] = [];
      }
      this.messages[friendId].push(message);
    }
  },

  persist: true
}); 