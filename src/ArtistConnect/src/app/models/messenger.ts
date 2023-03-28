export interface Conversation {
    user1: string;
    user2: string;
    lastMessage: string;
    unreadCount: number;
    messages: Message[];
  }
  
  export interface Message {
    content: string;
    senderId: string;
  }