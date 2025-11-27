import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { messagesService } from "@/services/api/messagesService";
import { formatDistanceToNow } from "date-fns";

const Messages = () => {
const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState({ Id: 1, displayName: "Current User" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.Id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagesService.getConversations();
      setConversations(data);
    } catch (err) {
      setError(err.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await messagesService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageData = {
      conversationId: selectedConversation.Id,
      senderId: currentUser.Id,
      content: newMessage.trim()
    };

    try {
      const message = await messagesService.sendMessage(messageData);
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Update conversation preview
      setConversations(prev =>
        prev.map(conv =>
          conv.Id === selectedConversation.Id
            ? { ...conv, lastMessage: newMessage.trim(), lastMessageAt: new Date().toISOString() }
            : conv
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={loadConversations} />;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
      <div className="flex h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Conversations List */}
        <div className={`w-full lg:w-80 border-r border-gray-200 flex flex-col ${selectedConversation ? "hidden lg:flex" : "flex"}`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Messages
              </h2>
              <button className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <ApperIcon name="Plus" size={20} />
              </button>
            </div>
          </div>

{/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Conversations */}
<div className="flex-1 overflow-y-auto">
            {(() => {
              const filteredConversations = conversations.filter(conversation =>
                conversation.otherUser?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
              );
              
              return filteredConversations.length === 0 ? (
                <div className="p-6">
                  <Empty
                    icon="MessageCircle"
                    title={searchQuery ? "No conversations found" : "No conversations"}
                    description={searchQuery ? "Try searching for a different name." : "Start a new conversation to connect with friends."}
                    actionText="New Message"
                  />
                </div>
              ) : (
                <div className="space-y-1 p-2">
{filteredConversations.map((conversation) => (
                    <motion.button
                      key={conversation.Id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        selectedConversation?.Id === conversation.Id
                          ? "bg-primary/10 border-primary/20"
                          : "hover:bg-gray-50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={conversation.otherUser?.profilePicture}
                          alt={conversation.otherUser?.displayName}
                          size="lg"
                          online={conversation.otherUser?.online}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-display font-semibold text-gray-900 truncate">
                              {conversation.otherUser?.displayName || "Unknown User"}
                            </h4>
                            <span className="text-xs text-gray-500 font-body ml-2">
                              {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-body truncate mt-1">
                            {conversation.lastMessage || "No messages yet"}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <div className="inline-flex items-center justify-center w-5 h-5 bg-primary text-white text-xs rounded-full mt-1">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              );
            })()}
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${selectedConversation ? "flex" : "hidden lg:flex"}`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden p-2 text-gray-600 hover:text-primary rounded-lg transition-colors mr-2"
                  >
                    <ApperIcon name="ArrowLeft" size={20} />
                  </button>
                  <Avatar
                    src={selectedConversation.otherUser?.profilePicture}
                    alt={selectedConversation.otherUser?.displayName}
                    size="lg"
                    online={selectedConversation.otherUser?.online}
                  />
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-gray-900">
                      {selectedConversation.otherUser?.displayName || "Unknown User"}
                    </h3>
                    <p className="text-sm text-gray-600 font-body">
                      {selectedConversation.otherUser?.online ? "Online" : "Offline"}
                    </p>
                  </div>
                  <button className="p-2 text-gray-600 hover:text-primary rounded-lg transition-colors">
                    <ApperIcon name="Phone" size={20} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-primary rounded-lg transition-colors">
                    <ApperIcon name="Video" size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 font-body">
                      Start the conversation with {selectedConversation.otherUser?.displayName}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.Id}
                      className={`flex ${message.senderId === currentUser.Id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl font-body ${
                          message.senderId === currentUser.Id
                            ? "bg-gradient-coral text-white"
                            : "bg-white text-gray-900 shadow-sm border border-gray-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === currentUser.Id
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-body text-gray-900 placeholder-gray-500 resize-none focus:border-primary focus:outline-none focus:ring-0 transition-colors duration-200"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-3"
                  >
                    <ApperIcon name="Send" size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden lg:flex flex-1 items-center justify-center">
              <Empty
                icon="MessageCircle"
                title="Select a conversation"
                description="Choose a conversation from the sidebar to start messaging."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;