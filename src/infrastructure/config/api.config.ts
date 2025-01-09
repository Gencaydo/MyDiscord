export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
  },
  ROOMS: {
    BASE: '/rooms',
    JOIN: (id: string) => `/rooms/${id}/join`,
    LEAVE: (id: string) => `/rooms/${id}/leave`,
    MEMBERS: (id: string) => `/rooms/${id}/members`,
  },
  CHAT: {
    BASE: '/chat',
    MESSAGES: (roomId: string) => `/chat/${roomId}/messages`,
    REACTIONS: (messageId: string) => `/chat/messages/${messageId}/reactions`,
  },
  MEETINGS: {
    BASE: '/meetings',
    JOIN: (id: string) => `/meetings/${id}/join`,
    LEAVE: (id: string) => `/meetings/${id}/leave`,
  }
}; 