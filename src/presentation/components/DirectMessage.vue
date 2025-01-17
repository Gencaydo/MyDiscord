<template>
  <div class="chat-container">
    <div class="chat-main">
      <button class="mobile-back" @click="$emit('back')">&larr; Back</button>
      <!-- Chat Header -->
      <div class="chat-header">
        <button class="back-button" @click="$emit('back')">←</button>
        <img :src="friend.avatar" :alt="friend.username" class="avatar" />
        <div class="friend-info">
          <span class="username">{{ friend.username }}</span>
          <span class="status" :class="friend.status">{{ friend.status }}</span>
        </div>
        <div class="header-actions">
          <button class="action-button" @click="$emit('block')">
            <span class="block-icon">🚫</span>
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="messages-container" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id" class="message">
          <img :src="message.sender.avatar" :alt="message.sender.username" class="avatar" />
          <div class="message-content">
            <div class="message-header">
              <span class="username">{{ message.sender.username }}</span>
              <span class="timestamp">{{ formatDate(message.timestamp) }}</span>
            </div>
            <p class="message-text">{{ message.content }}</p>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="chat-input">
        <div class="input-container">
          <button class="attach-btn">+</button>
          <input 
            type="text" 
            v-model="newMessage"
            @keyup.enter="sendMessage"
            :placeholder="`Message @${friend.username}`"
          />
          <div class="input-actions">
            <button class="action-btn">🎁</button>
            <button class="action-btn">GIF</button>
            <button class="action-btn">😊</button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Profile Sidebar -->
    <div class="user-profile-sidebar">
      <div class="profile-header">
        <img :src="friend.avatar" :alt="friend.username" class="profile-avatar" />
        <h2 class="profile-username">{{ friend.username }}</h2>
        <span class="profile-status" :class="friend.status">
          {{ friend.status.charAt(0).toUpperCase() + friend.status.slice(1) }}
        </span>
      </div>

      <div class="profile-section">
        <h3>Member Since</h3>
        <p>{{ formatDate(friend.createdAt) }}</p>
      </div>

      <div class="profile-section">
        <h3>Note</h3>
        <textarea 
          placeholder="Click to add a note" 
          class="note-input"
        ></textarea>
      </div>

      <div class="profile-section">
        <h3>Roles</h3>
        <div class="roles-list">
          <span 
            v-for="role in friend.roles" 
            :key="role.id" 
            class="role-badge"
            :style="{ backgroundColor: role.color }"
          >
            {{ role.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType, computed } from 'vue';
import { User } from '@/core/domain/models/User';
import { useChatStore } from '@/stores/chat';

interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: Date;
}

export default defineComponent({
  name: 'DirectMessage',
  emits: ['back', 'block'],
  props: {
    friend: {
      type: Object as PropType<User>,
      required: true
    }
  },
  setup(props) {
    const newMessage = ref('');
    const chatStore = useChatStore();
    const messages = computed(() => chatStore.getMessages(props.friend.id));
    const messagesContainer = ref<HTMLElement | null>(null);

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleTimeString();
    };

    const sendMessage = () => {
      if (!newMessage.value.trim()) return;
      
      chatStore.addMessage(props.friend.id, {
        id: Date.now().toString(),
        content: newMessage.value,
        sender: {
          id: '1',
          username: 'You',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
          email: 'test@test.com',
          status: 'online',
          roles: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as User,
        timestamp: new Date()
      });

      newMessage.value = '';
      scrollToBottom();
    };

    const showBlockConfirmation = () => {
      const result = window.confirm('Do you want to block this user?\n\nClick "OK" to block\nClick "Cancel" to cancel');
      if (result) {
        // Implement block logic here
        console.log('User blocked');
      }
    };

    const scrollToBottom = () => {
      setTimeout(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      }, 0);
    };

    return {
      newMessage,
      messages,
      messagesContainer,
      formatDate,
      sendMessage,
      showBlockConfirmation
    };
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100%;
  width: 100%;
  background: #36393f;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Add responsive styles */
@media (max-width: 768px) {
  .chat-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }

  .user-profile-sidebar {
    display: none;
  }
}

/* Add back button for mobile */
.mobile-back {
  display: none;
  padding: 8px;
  background: none;
  border: none;
  color: #dcddde;
  cursor: pointer;
}

@media (max-width: 768px) {
  .mobile-back {
    display: block;
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 11;
  }
}

/* User Profile Sidebar Styles */
.user-profile-sidebar {
  width: 340px;
  background: #2f3136;
  border-left: 1px solid #202225;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #202225;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 16px;
}

.profile-username {
  color: #fff;
  font-size: 20px;
  margin-bottom: 8px;
}

.profile-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  background: #3ba55c;
}

.profile-status.idle {
  background: #faa61a;
}

.profile-status.dnd {
  background: #ed4245;
}

.profile-section {
  margin-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #202225;
}

.profile-section h3 {
  color: #b9bbbe;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.note-input {
  width: 100%;
  background: #40444b;
  border: none;
  border-radius: 4px;
  padding: 8px;
  color: #dcddde;
  resize: none;
  height: 60px;
}

.roles-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.profile-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-action-btn {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background: #4f545c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.profile-action-btn.danger {
  background: #ed4245;
}

.profile-action-btn:hover {
  filter: brightness(1.1);
}

.chat-header {
  padding: 12px 16px;
  background: #36393f;
  border-bottom: 1px solid #202225;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  color: #b9bbbe;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
}

.action-btn:hover {
  color: #dcddde;
  background: #40444b;
}

.search-input {
  background: #202225;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  color: #dcddde;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #36393f;
}

.message {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.message-content {
  flex: 1;
}

.message-header {
  margin-bottom: 4px;
}

.username {
  font-weight: 500;
  color: #fff;
}

.timestamp {
  font-size: 0.75rem;
  color: #72767d;
  margin-left: 8px;
}

.message-text {
  color: #dcddde;
  line-height: 1.4;
}

.chat-input {
  padding: 16px;
  background: #36393f;
}

.input-container {
  background: #40444b;
  border-radius: 8px;
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.attach-btn {
  background: none;
  border: none;
  color: #b9bbbe;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
}

input {
  flex: 1;
  background: none;
  border: none;
  padding: 12px;
  color: #dcddde;
}

input:focus {
  outline: none;
}

.input-actions {
  display: flex;
  gap: 8px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3ba55c;
}

.status.idle {
  background: #faa61a;
}

.status.dnd {
  background: #ed4245;
}

.action-button {
  background: none;
  border: none;
  color: #dcddde;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
}

.action-button:hover {
  background: #4f545c;
}

.block-icon {
  font-size: 16px;
}
</style> 