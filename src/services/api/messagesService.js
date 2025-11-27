import conversationsData from "@/services/mockData/conversations.json";
import messagesData from "@/services/mockData/messages.json";
import { usersService } from "@/services/api/usersService";

class MessagesService {
  constructor() {
    this.conversations = [...conversationsData];
    this.messages = [...messagesData];
    this.delay = 300;
  }

  async getConversations() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    // Enrich conversations with user data
    const enrichedConversations = await Promise.all(
      this.conversations.map(async (conv) => {
        // Get the other user (assuming current user is ID 1)
        const otherUserId = conv.participants.find(id => id !== 1);
        try {
          const otherUser = await usersService.getById(otherUserId);
          return { ...conv, otherUser };
        } catch {
          return { ...conv, otherUser: null };
        }
      })
    );
    
    // Sort by last message time, newest first
    return enrichedConversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
  }

  async getMessages(conversationId) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const conversationMessages = this.messages.filter(m => m.conversationId === conversationId);
    
    // Sort by creation time, oldest first
    return conversationMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async sendMessage(messageData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const newMessage = {
      Id: Math.max(...this.messages.map(m => m.Id)) + 1,
      ...messageData,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    this.messages.push(newMessage);
    
    // Update conversation last message
    const convIndex = this.conversations.findIndex(c => c.Id === messageData.conversationId);
    if (convIndex !== -1) {
      this.conversations[convIndex].lastMessage = messageData.content;
      this.conversations[convIndex].lastMessageAt = newMessage.createdAt;
    }
    
    return { ...newMessage };
  }

  async markAsRead(messageId) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const message = this.messages.find(m => m.Id === messageId);
    if (message) {
      message.isRead = true;
    }
    
    return true;
  }

  async deleteMessage(messageId) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const index = this.messages.findIndex(m => m.Id === messageId);
    if (index === -1) {
      throw new Error("Message not found");
    }
    
    this.messages.splice(index, 1);
    return true;
  }
}

export const messagesService = new MessagesService();