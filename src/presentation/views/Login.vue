<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Welcome Back!</h1>
      <p>We're so excited to see you again!</p>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            placeholder="test@test.com"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="password123"
          />
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
        
        <p class="login-hint">
          Hint: Use test@test.com / password123
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const isLoading = ref(false);

    const handleLogin = async () => {
      try {
        isLoading.value = true;
        error.value = '';
        
        await authStore.login(
          email.value, 
          password.value 
        );
        
        await router.push('/rooms');
      } catch (err) {
        error.value = 'Invalid email or password';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      error,
      isLoading,
      handleLogin,
    };
  },
});
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #36393f;
}

.login-card {
  background: #2f3136;
  padding: 2rem;
  border-radius: 5px;
  width: 100%;
  max-width: 480px;
  color: #fff;
}

.login-form {
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #b9bbbe;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #202225;
  background: #40444b;
  color: #fff;
  border-radius: 3px;
}

.login-button {
  width: 100%;
  padding: 0.8rem;
  background: #5865f2;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 1rem;
}

.register-text {
  text-align: center;
  margin-top: 1rem;
  color: #b9bbbe;
}

.register-text a {
  color: #00b0f4;
  text-decoration: none;
}

.error-message {
  background: #f04747;
  color: white;
  padding: 0.5rem;
  border-radius: 3px;
  margin-bottom: 1rem;
}

.login-hint {
  text-align: center;
  margin-top: 1rem;
  color: #72767d;
  font-size: 0.9rem;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 