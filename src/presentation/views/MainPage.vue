<template>
  <div class="main-container">
    <!-- Left Sidebar -->
    <div class="left-sidebar">
      <!-- Server List -->
      <div class="server-list">
        <div class="server-item home">
          <img src="@/assets/discord-logo.png" alt="Discord" />
        </div>
        <div class="server-divider"></div>
        <div class="server-item">S</div>
        <div class="server-item add">
          <span>+</span>
        </div>
      </div>
    </div>

    <!-- Channel Sidebar -->
    <div class="channel-sidebar">
      <div class="channel-header">
        <h2>Direct Messages</h2>
      </div>

      <!-- Friends Section -->
      <div class="friends-section">
        <div 
          class="section-item" 
          :class="{ active: selectedSection === 'friends' }"
          @click="selectSection('friends')"
        >
          <div class="icon">👥</div>
          Friends
        </div>
        <div 
          class="section-item"
          :class="{ active: selectedSection === 'nitro' }"
          @click="selectSection('nitro')"
        >
          <div class="icon">📩</div>
          Nitro
        </div>
        <div 
          class="section-item"
          :class="{ active: selectedSection === 'shop' }"
          @click="selectSection('shop')"
        >
          <div class="icon">🏪</div>
          Shop
        </div>
      </div>

      <div class="section-divider"></div>

      <!-- Direct Messages -->
      <div class="direct-messages">
        <h3>DIRECT MESSAGES</h3>
        <div class="dm-list">
          <div 
            v-for="friend in friends" 
            :key="friend.id" 
            class="dm-item"
            @click="selectFriend(friend)"
            :class="{ active: selectedFriend?.id === friend.id }"
          >
            <img :src="friend.avatar" :alt="friend.username" class="avatar" />
            <span class="username">{{ friend.username }}</span>
            <span class="status" :class="friend.status"></span>
          </div>
        </div>
      </div>

      <!-- User Profile -->
      <div class="user-profile">
        <img :src="currentUser?.avatar" :alt="currentUser?.username" class="avatar" />
        <div class="user-info">
          <span class="username">{{ currentUser?.username }}</span>
          <span class="status">Online</span>
        </div>
        <div class="user-controls">
          <button @click="toggleMute">🎤</button>
          <button @click="toggleDeafen">🎧</button>
          <button @click="openSettings">⚙️</button>
          <button @click="handleLogout" class="logout-btn">🚪</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="content-header">
        <div class="header-tabs">
          <button class="tab active">Online</button>
          <button class="tab">All</button>
          <button class="tab">Pending</button>
          <button class="tab" @click="showBlockConfirmation">Blocked</button>
          <button class="add-friend">Add Friend</button>
        </div>
      </div>

      <DirectMessage 
        v-if="selectedFriend" 
        :friend="selectedFriend" 
        @back="selectedFriend = null"
        @block="showBlockConfirmation"
      />
      <div v-else-if="selectedSection !== 'friends'" class="empty-section">
        <p>This section is currently empty</p>
      </div>
    </div>

    <!-- Add Modal -->
    <Modal
      :is-open="showBlockModal"
      title="Block User"
      message="Do you want to block this user?"
      @yes="handleBlockYes"
      @no="handleBlockNo"
      @cancel="handleBlockCancel"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import DirectMessage from '@/presentation/components/DirectMessage.vue';
import { User } from '@/core/domain/models/User';
import { useRouter } from 'vue-router';
import Modal from '@/presentation/components/Modal.vue';

export default defineComponent({
  name: 'MainPage',
  components: {
    DirectMessage,
    Modal
  },
  setup() {
    const authStore = useAuthStore();
    const currentUser = computed(() => authStore.user);
    const selectedFriend = ref<User | null>(null);
    const router = useRouter();
    const selectedSection = ref('friends');
    const showBlockModal = ref(false);

    const friends = ref<User[]>([
      {
        id: '1',
        username: 'Jouto',
        email: 'jouto@test.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        status: 'online',
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        username: 'Strawberry',
        email: 'strawberry@test.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        status: 'idle',
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        username: 'NAZMI',
        email: 'nazmi@test.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
        status: 'dnd',
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const selectFriend = (friend: User) => {
      selectedFriend.value = friend;
    };

    const toggleMute = () => {
      // Implement mute logic
    };

    const toggleDeafen = () => {
      // Implement deafen logic
    };

    const openSettings = () => {
      // Implement settings logic
    };

    const handleLogout = () => {
      authStore.logout();
      router.push('/login');
    };

    const selectSection = (section: string) => {
      selectedSection.value = section;
    };

    const showBlockConfirmation = () => {
      showBlockModal.value = true;
    };

    const handleBlockYes = () => {
      // Implement block logic here
      console.log('User blocked');
      showBlockModal.value = false;
    };

    const handleBlockNo = () => {
      console.log('Block rejected');
      showBlockModal.value = false;
    };

    const handleBlockCancel = () => {
      showBlockModal.value = false;
    };

    return {
      currentUser,
      friends,
      selectedFriend,
      selectFriend,
      toggleMute,
      toggleDeafen,
      openSettings,
      handleLogout,
      selectedSection,
      selectSection,
      showBlockModal,
      showBlockConfirmation,
      handleBlockYes,
      handleBlockNo,
      handleBlockCancel
    };
  }
});
</script>

<style scoped>
.main-container {
  display: grid;
  grid-template-columns: minmax(72px, auto) minmax(240px, 300px) 1fr;
  height: 100vh;
  background: #36393f;
}

@media (max-width: 768px) {
  .main-container {
    grid-template-columns: 1fr;
  }
  
  .left-sidebar,
  .channel-sidebar {
    display: none;
  }
  
  .chat-container {
    width: 100vw;
  }
}

.left-sidebar {
  background: #202225;
  padding: 12px 0;
}

.server-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.server-item {
  width: 48px;
  height: 48px;
  background: #36393f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: border-radius 0.2s;
}

.server-item:hover {
  border-radius: 16px;
  background: #5865f2;
}

.server-item.add {
  background: #36393f;
  color: #3ba55c;
}

.server-divider {
  height: 2px;
  width: 32px;
  background: #36393f;
  margin: 4px 0;
}

.channel-sidebar {
  background: #2f3136;
  display: flex;
  flex-direction: column;
}

.channel-header {
  padding: 16px;
  border-bottom: 1px solid #202225;
}

.friends-section {
  padding: 8px;
}

.section-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  color: #dcddde;
  cursor: pointer;
}

.section-item:hover {
  background: #36393f;
  border-radius: 4px;
}

.section-divider {
  height: 1px;
  background: #202225;
  margin: 8px 0;
}

.direct-messages {
  flex: 1;
  padding: 8px;
}

.direct-messages h3 {
  color: #96989d;
  font-size: 12px;
  padding: 8px;
}

.dm-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  color: #dcddde;
  cursor: pointer;
}

.dm-item:hover {
  background: #36393f;
  border-radius: 4px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-profile {
  padding: 8px;
  background: #292b2f;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info {
  flex: 1;
}

.user-controls {
  display: flex;
  gap: 4px;
}

.user-controls button {
  background: none;
  border: none;
  color: #dcddde;
  cursor: pointer;
  padding: 4px;
}

.main-content {
  background: #36393f;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow-y: auto;
}

.content-header {
  padding: 16px;
  border-bottom: 1px solid #202225;
}

.header-tabs {
  display: flex;
  gap: 16px;
  align-items: center;
}

.tab {
  background: none;
  border: none;
  color: #dcddde;
  cursor: pointer;
  padding: 4px 8px;
}

.tab.active {
  background: #404249;
  border-radius: 4px;
}

.add-friend {
  margin-left: auto;
  background: #3ba55c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.section-item.active {
  background: #404249;
}

.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #dcddde;
  text-align: center;
  padding: 20px;
}

.empty-section h2 {
  font-size: 24px;
  margin-bottom: 12px;
}

.empty-section p {
  color: #96989d;
}

.section-header {
  padding: 16px;
}

.section-header h2 {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}
</style> 