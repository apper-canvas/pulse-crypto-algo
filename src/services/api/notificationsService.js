import notificationsData from "@/services/mockData/notifications.json";
import { usersService } from "@/services/api/usersService";

class NotificationsService {
  constructor() {
    this.notifications = [...notificationsData];
    this.delay = 300;
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    // Enrich notifications with actor data
    const enrichedNotifications = await Promise.all(
      this.notifications.map(async (notification) => {
        try {
          const actor = await usersService.getById(notification.actorId);
          return { ...notification, actor };
        } catch {
          return { ...notification, actor: null };
        }
      })
    );
    
    // Sort by creation date, newest first
    return enrichedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async markAsRead(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const notification = this.notifications.find(n => n.Id === id);
    if (notification) {
      notification.isRead = true;
    }
    
    return true;
  }

  async markAllAsRead() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    
    return true;
  }

  async create(notificationData) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const newNotification = {
      Id: Math.max(...this.notifications.map(n => n.Id)) + 1,
      ...notificationData,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    this.notifications.unshift(newNotification);
    
    // Enrich with actor data for return
    try {
      const actor = await usersService.getById(newNotification.actorId);
      return { ...newNotification, actor };
    } catch {
      return { ...newNotification, actor: null };
    }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    const index = this.notifications.findIndex(n => n.Id === id);
    if (index === -1) {
      throw new Error("Notification not found");
    }
    
    this.notifications.splice(index, 1);
    return true;
  }
}

export const notificationsService = new NotificationsService();