<template>
  <div class="room">
    <div class="room-header">
      <h2>{{ room.name }}</h2>
      <div class="room-controls">
        <button @click="leaveRoom" class="leave-btn">
          <span class="icon">🚪</span>
          Leave Room
        </button>
        <button @click="toggleVideo" :class="{ active: isVideoEnabled }">
          <span class="icon">{{ isVideoEnabled ? '🎥' : '❌' }}</span>
          {{ isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera' }}
        </button>
        <button @click="toggleAudio" :class="{ active: isAudioEnabled }">
          <span class="icon">{{ isAudioEnabled ? '🎤' : '🔇' }}</span>
          {{ isAudioEnabled ? 'Mute' : 'Unmute' }}
        </button>
      </div>
    </div>

    <div class="room-content">
      <div class="communication-grid">
        <!-- Video/Voice Section -->
        <div class="video-grid">
          <!-- Local user video -->
          <div class="video-container local">
            <div v-if="!isVideoEnabled" class="video-placeholder">
              <span class="user-icon">👤</span>
            </div>
            <video ref="localVideo" autoplay muted playsinline></video>
            <div class="video-overlay">
              <span class="username">You</span>
              <div class="controls">
                <button @click="toggleVideo">
                  {{ isVideoEnabled ? '🎥' : '❌' }}
                </button>
                <button @click="toggleAudio">
                  {{ isAudioEnabled ? '🎤' : '🔇' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Remote participants -->
          <div v-for="member in room.members" :key="member.id" class="video-container">
            <div v-if="!member.isVideoEnabled" class="video-placeholder">
              <span class="user-icon">👤</span>
            </div>
            <video :ref="'remoteVideo_' + member.id" autoplay playsinline></video>
            <div class="video-overlay">
              <span class="username">{{ member.username }}</span>
              <div class="member-status">
                <span v-if="!member.isAudioEnabled" class="status-icon">
                  <div class="muted-icon">🔇</div>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Section -->
        <div class="chat-section">
          <div class="chat-messages">
            <div v-for="message in messages" :key="message.id" class="message">
              <img :src="message.sender.avatar" class="avatar" />
              <div class="message-content">
                <div class="message-header">
                  <span class="username">{{ message.sender.username }}</span>
                  <span class="timestamp">{{ formatDate(message.createdAt) }}</span>
                </div>
                <div class="message-text">{{ message.content }}</div>
              </div>
            </div>
          </div>
          <div class="chat-input">
            <textarea
              v-model="newMessage"
              @keyup.enter="sendMessage"
              placeholder="Type a message..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import { useWebRTCStore } from '@/stores/webrtc';
import { useRoomStore } from '@/stores/room';
import { Room } from '@/core/domain/models/Room';
import { Chat } from '@/core/domain/models/Chat';

export default defineComponent({
  name: 'Room',
  emits: ['roomLeft'],
  props: {
    room: {
      type: Object as () => Room,
      required: true,
    },
  },
  setup(props, { emit }) {
    const webrtcStore = useWebRTCStore();
    const roomStore = useRoomStore();
    const messages = ref<Chat[]>([]);
    const newMessage = ref('');
    const localVideo = ref<HTMLVideoElement | null>(null);

    onMounted(async () => {
      try {
        await webrtcStore.joinRoom(props.room.id);
        if (localVideo.value) {
          const stream = webrtcStore.webrtcService.getLocalStream();
          if (stream) {
            localVideo.value.srcObject = stream as MediaProvider;
          }
        }
      } catch (error) {
        console.error('Failed to join room:', error);
      }
    });

    onUnmounted(() => {
      webrtcStore.leaveRoom();
    });

    const sendMessage = () => {
      // Implement message sending logic
    };

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleString();
    };

    const leaveRoom = () => {
      webrtcStore.leaveRoom();
      roomStore.leaveCurrentRoom();
      emit('roomLeft');
    };

    return {
      messages,
      newMessage,
      localVideo,
      isVideoEnabled: computed(() => webrtcStore.isVideoEnabled),
      isAudioEnabled: computed(() => webrtcStore.isAudioEnabled),
      toggleVideo: () => webrtcStore.toggleVideo(),
      toggleAudio: () => webrtcStore.toggleAudio(),
      sendMessage,
      formatDate,
      leaveRoom,
    };
  },
});
</script>

<style scoped>
.room {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.room-header {
  padding: 1rem;
  background: #2f3136;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-controls {
  display: flex;
  gap: 1rem;
}

.room-controls button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #4f545c;
  color: white;
  cursor: pointer;
}

.room-controls button.active {
  background: #43b581;
}

.room-content {
  flex: 1;
  overflow: hidden;
  background: linear-gradient(135deg, #2f3136 0%, #36393f 100%);
  border-radius: 8px;
  margin: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.communication-grid {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  gap: 1rem;
  padding: 1rem;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  gap: 1rem;
  padding: 1rem;
  justify-content: center;
}

.video-container {
  position: relative;
  width: 200px;
  height: 200px;
  background: #18191c;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2f3136;
}

.user-icon {
  font-size: 2rem;
  color: #dcddde;
}

.muted-icon {
  background: #f04747;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.username {
  color: white;
  font-size: 0.9rem;
}

.controls {
  display: flex;
  gap: 0.5rem;
}

.controls button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
}

.member-status {
  display: flex;
  gap: 0.25rem;
}

.status-icon {
  color: white;
  font-size: 0.9rem;
}

.chat-section {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.chat-input {
  padding: 1rem;
  background: #40444b;
  border-radius: 8px;
}

.chat-input textarea {
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: white;
  resize: none;
}

.chat-input textarea:focus {
  outline: none;
}

.leave-btn {
  background: #f04747 !important;
}
</style> 