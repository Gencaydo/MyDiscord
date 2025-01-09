<template>
  <div class="room-list-container">
    <div class="sidebar">
      <div class="user-info">
        <img :src="currentUser?.avatar" class="avatar" />
        <span>{{ currentUser?.username }}</span>
      </div>
      
      <div class="room-actions">
        <button @click="showCreateRoomModal = true" class="create-room-btn">
          Create Room
        </button>
        <button @click="showJoinRoomModal = true" class="join-room-btn">
          Join Room
        </button>
        <button @click="handleLogout" class="logout-btn">
          <span class="icon">🚪</span> Logout
        </button>
      </div>

      <div class="rooms-list">
        <div 
          v-for="room in rooms" 
          :key="room.id" 
          class="room-item"
          :class="{ active: selectedRoom?.id === room.id }"
          @click="selectRoom(room)"
        >
          <span class="room-type-icon">#</span>
          {{ room.name }}
        </div>
      </div>
    </div>

    <div class="main-content">
      <Room 
        v-if="selectedRoom" 
        :room="selectedRoom" 
        @roomLeft="handleRoomLeft"
      />
      <div v-else class="no-room-selected">
        <h2>Welcome to Discord Clone!</h2>
        <p>Select a room to start chatting or create a new one.</p>
      </div>
    </div>

    <!-- Create Room Modal -->
    <Modal v-if="showCreateRoomModal" @close="showCreateRoomModal = false">
      <template #header>Create New Room</template>
      <template #default>
        <form @submit.prevent="handleCreateRoom" class="room-form">
          <div class="form-group">
            <label for="roomName">Room Name</label>
            <input 
              type="text" 
              id="roomName" 
              v-model="roomName" 
              required
            />
          </div>

          <button type="submit" class="submit-btn">Create Room</button>
        </form>
      </template>
    </Modal>

    <!-- Join Room Modal -->
    <Modal v-if="showJoinRoomModal" @close="showJoinRoomModal = false">
      <template #header>Join Room</template>
      <template #default>
        <form @submit.prevent="handleJoinRoom" class="room-form">
          <div class="form-group">
            <label for="roomCode">Room Code</label>
            <input 
              type="text" 
              id="roomCode" 
              v-model="roomCode" 
              required
              placeholder="Enter room code"
            />
          </div>
          <button type="submit" class="submit-btn">Join Room</button>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import Room from '@/presentation/components/Room.vue';
import Modal from '@/presentation/components/Modal.vue';
import { Room as RoomType } from '@/core/domain/models/Room';
import { useRouter } from 'vue-router';
import { useRoomStore } from '@/stores/room';
import { useAuthStore } from '@/stores/auth';
import { useWebRTCStore } from '@/stores/webrtc';

export default defineComponent({
  name: 'RoomList',
  components: {
    Room,
    Modal,
  },
  setup() {
    const router = useRouter();
    const roomStore = useRoomStore();
    const authStore = useAuthStore();
    const webrtcStore = useWebRTCStore();
    const selectedRoom = ref<RoomType | null>(null);
    const showCreateRoomModal = ref(false);
    const showJoinRoomModal = ref(false);
    const roomName = ref('');
    const roomCode = ref('');

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
      }
    });

    const selectRoom = (room: RoomType) => {
      selectedRoom.value = room;
    };

    const handleCreateRoom = async () => {
      try {
        const room = await roomStore.createRoom(roomName.value);
        selectRoom(room);
        roomName.value = '';
        showCreateRoomModal.value = false;
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to create room');
        return;
      }
    };

    const handleJoinRoom = async () => {
      try {
        const room = await roomStore.joinRoom(roomCode.value);
        selectRoom(room);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to join room');
        return;
      }
      showJoinRoomModal.value = false;
    };

    const leaveRoom = () => {
      webrtcStore.leaveRoom();
      roomStore.leaveCurrentRoom();
      selectedRoom.value = null;
    };

    const handleLogout = () => {
      authStore.logout();
      router.push('/login');
    };

    const handleRoomLeft = () => {
      selectedRoom.value = null;
      showCreateRoomModal.value = false;
      showJoinRoomModal.value = false;
    };

    return {
      rooms: computed(() => roomStore.getRooms),
      selectedRoom,
      showCreateRoomModal,
      showJoinRoomModal,
      currentUser: computed(() => authStore.user),
      roomName,
      roomCode,
      selectRoom,
      handleCreateRoom,
      handleJoinRoom,
      handleLogout,
      leaveRoom,
      handleRoomLeft,
    };
  },
});
</script>

<style scoped>
.room-list-container {
  display: grid;
  grid-template-columns: 240px 1fr;
  height: 100vh;
}

.sidebar {
  background: #2f3136;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #292b2f;
  border-radius: 4px;
  margin-bottom: 1rem;
  position: relative;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.room-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.create-room-btn,
.join-room-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-room-btn {
  background: #5865f2;
  color: white;
}

.join-room-btn {
  background: #4f545c;
  color: white;
}

.rooms-list {
  flex: 1;
  overflow-y: auto;
}

.room-item {
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dcddde;
}

.room-item:hover {
  background: #36393f;
}

.room-item.active {
  background: #393c43;
}

.room-type-icon {
  font-weight: bold;
}

.main-content {
  background: #36393f;
}

.no-room-selected {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #dcddde;
}

.room-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.submit-btn {
  padding: 0.5rem;
  background: #5865f2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn {
  background: #f04747;
  border: none;
  color: #dcddde;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.logout-btn:hover {
  background: #d84444;
  color: white;
}

.icon {
  font-size: 16px;
}
</style> 