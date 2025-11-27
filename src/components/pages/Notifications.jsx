import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { notificationsService } from "@/services/api/notificationsService";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.isRead) {
      await notificationsService.markAsRead(notification.Id);
      setNotifications(prev =>
        prev.map(n => n.Id === notification.Id ? { ...n, isRead: true } : n)
      );
    }

    // Navigate based on notification type
    if (notification.type === "follow") {
      navigate(`/profile/${notification.actorId}`);
    } else if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return { name: "Heart", color: "text-primary" };
      case "comment":
        return { name: "MessageCircle", color: "text-secondary" };
      case "follow":
        return { name: "UserPlus", color: "text-success" };
      case "message":
        return { name: "Mail", color: "text-info" };
      default:
        return { name: "Bell", color: "text-gray-500" };
    }
  };

  const getNotificationText = (notification) => {
    const actorName = notification.actor?.displayName || "Someone";
    
    switch (notification.type) {
      case "like":
        return `${actorName} liked your post`;
      case "comment":
        return `${actorName} commented on your post`;
      case "follow":
        return `${actorName} started following you`;
      case "message":
        return `${actorName} sent you a message`;
      default:
        return "New notification";
    }
  };

  const filters = [
    { id: "all", label: "All", count: notifications.length },
    { id: "mentions", label: "Mentions", count: notifications.filter(n => n.type === "comment").length },
    { id: "follows", label: "Follows", count: notifications.filter(n => n.type === "follow").length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "all") return true;
    if (activeFilter === "mentions") return notification.type === "comment";
    if (activeFilter === "follows") return notification.type === "follow";
    return true;
  });

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={loadNotifications} />;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Notifications
            </h1>
            <p className="text-gray-600 font-body mt-1">
              Stay updated with your latest activity
            </p>
          </div>
          
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary hover:text-secondary/80 hover:bg-secondary/10 rounded-lg transition-colors font-medium"
            >
              <ApperIcon name="CheckCheck" size={16} />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                activeFilter === filter.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <span className="font-body">{filter.label}</span>
              {filter.count > 0 && (
                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Empty
          icon="Bell"
          title="No notifications"
          description={`You don't have any ${activeFilter === "all" ? "" : activeFilter} notifications yet.`}
          actionText="Explore"
          onAction={() => navigate("/")}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {filteredNotifications.map((notification) => {
            const iconConfig = getNotificationIcon(notification.type);
            
            return (
              <motion.button
                key={notification.Id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full p-6 text-left hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? "bg-blue-50/50" : ""
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start space-x-4">
                  {/* Notification Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.type === "like" ? "bg-primary/20" :
                    notification.type === "comment" ? "bg-secondary/20" :
                    notification.type === "follow" ? "bg-success/20" :
                    "bg-gray-100"
                  }`}>
                    <ApperIcon 
                      name={iconConfig.name} 
                      size={20} 
                      className={iconConfig.color} 
                    />
                  </div>

                  {/* Actor Avatar */}
                  <Avatar
                    src={notification.actor?.profilePicture}
                    alt={notification.actor?.displayName}
                    size="md"
                  />

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-body text-gray-900 font-medium">
                        {getNotificationText(notification)}
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 font-body mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;