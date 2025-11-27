import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { notificationsService } from "@/services/api/notificationsService";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Avatar from "@/components/atoms/Avatar";
import Messages from "@/components/pages/Messages";
import Profile from "@/components/pages/Profile";
import Notifications from "@/components/pages/Notifications";
import Home from "@/components/pages/Home";
import NavigationTabs from "@/components/molecules/NavigationTabs";
import { cn } from "@/utils/cn";
function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [loading, setLoading] = useState(false)

  // Load notifications and unread count
  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const [notificationsData, count] = await Promise.all([
        notificationsService.getAll(),
        notificationsService.getUnreadCount()
      ])
      setNotifications(notificationsData.slice(0, 5)) // Show only 5 recent
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      try {
        await notificationsService.markAsRead(notification.Id)
        setNotifications(prev =>
          prev.map(n => n.Id === notification.Id ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    }
    
    // Close dropdown and navigate based on notification type
    setShowNotifications(false)
    if (notification.type === 'comment' && notification.postId) {
      navigate(`/post/${notification.postId}`)
    } else if (notification.type === 'follow' && notification.fromUserId) {
      navigate(`/profile/${notification.fromUserId}`)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return { name: 'Heart', color: 'text-red-500' }
      case 'comment':
        return { name: 'MessageCircle', color: 'text-blue-500' }
      case 'follow':
        return { name: 'UserPlus', color: 'text-green-500' }
      case 'mention':
        return { name: 'AtSign', color: 'text-purple-500' }
      default:
        return { name: 'Bell', color: 'text-gray-500' }
    }
  }
return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-sm border-r border-gray-100 p-6">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="mb-8">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="bg-gradient-coral w-10 h-10 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Zap" className="text-white" size={20} />
                </div>
                <span className="font-display font-bold text-xl text-gray-900">Pulse</span>
              </motion.div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1">
              <div className="space-y-2">
                <NavLink
                  to=""
                  end
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )
                  }
                >
                  <ApperIcon name="Home" size={20} />
                  <span>Home</span>
                </NavLink>

                {/* Notifications with Badge */}
                <div className="relative">
                  <NavLink
                    to="notifications"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )
                    }
                  >
                    <div className="relative">
                      <ApperIcon name="Bell" size={20} />
                      {unreadCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </motion.div>
                      )}
                    </div>
                    <span>Notifications</span>
                  </NavLink>
                  
                  {/* Notification Center Dropdown */}
                  <div className="absolute left-0 top-0 w-full">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="w-full h-full absolute inset-0 bg-transparent"
                      style={{ zIndex: 1 }}
                    />
                  </div>
                  
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-full ml-2 top-0 w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                      style={{ maxHeight: '80vh', overflowY: 'auto' }}
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-semibold text-gray-900">
                            Notifications
                          </h3>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <ApperIcon name="X" size={16} />
                          </button>
                        </div>
                        {unreadCount > 0 && (
                          <p className="text-sm text-gray-500 mt-1">
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                          <div className="p-4 text-center text-gray-500">
                            <ApperIcon name="Loader2" size={20} className="animate-spin mx-auto mb-2" />
                            Loading notifications...
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <ApperIcon name="Bell" size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => {
                            const iconConfig = getNotificationIcon(notification.type)
                            return (
                              <motion.button
                                key={notification.Id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                                  !notification.isRead ? "bg-blue-50/30" : ""
                                }`}
                                whileHover={{ x: 4 }}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`mt-1 ${iconConfig.color}`}>
                                    <ApperIcon name={iconConfig.name} size={16} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 font-medium">
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </p>
                                  </div>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                  )}
                                </div>
                              </motion.button>
                            )
                          })
                        )}
                      </div>
                      
                      {notifications.length > 0 && (
                        <div className="p-4 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setShowNotifications(false)
                              navigate('/notifications')
                            }}
                            className="w-full text-center text-primary hover:text-primary/80 font-medium text-sm py-2"
                          >
                            View All Notifications
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                <NavLink
                  to="messages"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )
                  }
                >
                  <ApperIcon name="MessageSquare" size={20} />
                  <span>Messages</span>
                </NavLink>

                <NavLink
                  to="profile"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )
                  }
                >
                  <ApperIcon name="User" size={20} />
                  <span>Profile</span>
                </NavLink>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80">
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="bg-gradient-coral w-8 h-8 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="text-white" size={16} />
              </div>
              <span className="font-display font-bold text-lg text-gray-900">Pulse</span>
            </motion.div>
            
            {/* Mobile Notification Center */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ApperIcon name="Bell" size={20} />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </motion.div>
                )}
              </button>
              
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                  style={{ maxHeight: '80vh', overflowY: 'auto' }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-semibold text-gray-900">
                        Notifications
                      </h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <ApperIcon name="X" size={16} />
                      </button>
                    </div>
                    {unreadCount > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">
                        <ApperIcon name="Loader2" size={20} className="animate-spin mx-auto mb-2" />
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <ApperIcon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const iconConfig = getNotificationIcon(notification.type)
                        return (
                          <button
                            key={notification.Id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                              !notification.isRead ? "bg-blue-50/30" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`mt-0.5 ${iconConfig.color}`}>
                                <ApperIcon name={iconConfig.name} size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium leading-tight">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />
                              )}
                            </div>
                          </button>
                        )
                      })
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setShowNotifications(false)
                          navigate('/notifications')
                        }}
                        className="w-full text-center text-primary hover:text-primary/80 font-medium text-sm py-2"
                      >
                        View All Notifications
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="pb-20">
          <Outlet />
        </main>

        {/* Mobile Navigation */}
        <NavigationTabs className="fixed bottom-0 left-0 right-0 z-40" />
      </div>

      {/* Global click handler to close notifications dropdown */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
/>
    </div>
  );
}

export default Layout;