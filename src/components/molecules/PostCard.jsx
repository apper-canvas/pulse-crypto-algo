import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";

const PostCard = ({ post, currentUser, onLike, onComment }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();

  const handleLike = async () => {
    const newLikedState = !isLiked;
    const newCount = newLikedState ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newLikedState);
    setLikeCount(newCount);
    
    if (onLike) {
      await onLike(post.Id, newLikedState);
    }
  };

  const handleProfileClick = () => {
    navigate(`/profile/${post.authorId}`);
  };

  const handlePostClick = () => {
    navigate(`/post/${post.Id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3">
          <button onClick={handleProfileClick}>
            <Avatar 
              src={post.author?.profilePicture} 
              alt={post.author?.displayName}
              size="lg"
              showRing={true}
            />
          </button>
          <div className="flex-1">
            <button 
              onClick={handleProfileClick}
              className="block text-left hover:text-primary transition-colors"
            >
              <h4 className="font-display font-semibold text-gray-900">
                {post.author?.displayName || "Unknown User"}
              </h4>
              <p className="text-sm text-gray-500 font-body">
                @{post.author?.username || "unknown"}
              </p>
            </button>
          </div>
          <div className="text-sm text-gray-500 font-body">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <button 
          onClick={handlePostClick}
          className="block text-left w-full group"
        >
          <p className="text-gray-900 font-body leading-relaxed group-hover:text-gray-700 transition-colors">
            {post.content}
          </p>
        </button>
      </div>

      {/* Post Media */}
      {post.mediaUrl && (
        <div className="px-6 pb-4">
          <button onClick={handlePostClick} className="block w-full">
            {post.mediaType === "image" ? (
              <img 
                src={post.mediaUrl} 
                alt="Post media"
                className="w-full h-64 sm:h-80 object-cover rounded-lg hover:opacity-95 transition-opacity"
              />
            ) : post.mediaType === "video" ? (
              <video 
                src={post.mediaUrl}
                controls
                className="w-full h-64 sm:h-80 rounded-lg"
                poster={post.mediaThumbnail}
              />
            ) : null}
          </button>
        </div>
      )}

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-50">
        <div className="flex items-center space-x-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors group"
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ApperIcon 
                name={isLiked ? "Heart" : "Heart"} 
                size={20}
                className={cn(
                  "transition-colors duration-200",
                  isLiked ? "text-primary fill-primary" : "group-hover:text-primary"
                )}
                fill={isLiked ? "currentColor" : "none"}
              />
            </motion.div>
            <span className="text-sm font-medium">{likeCount}</span>
          </motion.button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-600 hover:text-secondary transition-colors group"
          >
            <ApperIcon 
              name="MessageCircle" 
              size={20}
              className="group-hover:text-secondary transition-colors"
            />
            <span className="text-sm font-medium">{post.commentCount || 0}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-600 hover:text-accent transition-colors group">
            <ApperIcon 
              name="Share" 
              size={20}
              className="group-hover:text-accent transition-colors"
            />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-50 p-6 bg-gray-50">
          <div className="space-y-4">
            <div className="text-sm text-gray-500 font-body">
              Comments coming soon...
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;