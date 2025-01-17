<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-content">
        <p>{{ message }}</p>
      </div>
      <div class="modal-actions">
        <button class="btn-yes" @click="$emit('yes')">Yes</button>
        <button class="btn-no" @click="$emit('no')">No</button>
        <button class="btn-cancel" @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Modal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  emits: ['yes', 'no', 'cancel']
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: #36393f;
  border-radius: 5px;
  width: 440px;
  max-width: 90%;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #202225;
}

.modal-header h3 {
  color: #fff;
  margin: 0;
  font-size: 16px;
}

.modal-content {
  padding: 16px;
  color: #dcddde;
}

.modal-actions {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background: #2f3136;
  border-radius: 0 0 5px 5px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.btn-yes {
  background: #5865f2;
  color: white;
}

.btn-no {
  background: #ed4245;
  color: white;
}

.btn-cancel {
  background: #4f545c;
  color: white;
}
</style> 