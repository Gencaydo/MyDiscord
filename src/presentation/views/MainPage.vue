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
        <div class="section-item active">
          <div class="icon">👥</div>
          Friends
        </div>
        <div class="section-item">
          <div class="icon">📩</div>
          Nitro
        </div>
        <div class="section-item">
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
      <DirectMessage 
        v-if="selectedFriend" 
        :friend="selectedFriend" 
        @back="selectedFriend = null"
      />
      <div v-else class="content-header">
        <div class="header-tabs">
          <button class="tab active">Online</button>
          <button class="tab">All</button>
          <button class="tab">Pending</button>
          <button class="tab">Blocked</button>
          <button class="add-friend">Add Friend</button>
        </div>
      </div>

      <div class="active-now">
        <h2>Active Now</h2>
        <div class="empty-state">
          <img src="@/assets/wumpus.png" alt="Wumpus" class="wumpus" />
          <p>It's quiet for now...</p>
          <span>When a friend starts an activity—like playing a game or hanging out on voice—we'll show it here!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import DirectMessage from '@/presentation/components/DirectMessage.vue';
import { User } from '@/core/domain/models/User';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainPage',
  components: {
    DirectMessage
  },
  setup() {
    const authStore = useAuthStore();
    const currentUser = computed(() => authStore.user);
    const selectedFriend = ref<User | null>(null);
    const router = useRouter();

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

    return {
      currentUser,
      friends,
      selectedFriend,
      selectFriend,
      toggleMute,
      toggleDeafen,
      openSettings,
      handleLogout
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

.active-now {
  padding: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #dcddde;
  text-align: center;
}

.wumpus {
  width: 200px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 24px;
  margin-bottom: 8px;
}

.empty-state span {
  color: #96989d;
  max-width: 400px;
}

.section-item.active {
  background: #404249;
}
</style> 