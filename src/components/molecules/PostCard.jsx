import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { postsService } from "@/services/api/postsService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import { cn } from "@/utils/cn";

const PostCard = ({ post, currentUser, onLike, onComment }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
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

  const handlePrivacyClick = () => {
    setShowPrivacyModal(true);
  };

  const handlePrivacyUpdate = async (newPrivacy) => {
    try {
      const updatedPost = await postsService.update(currentPost.Id, { privacy: newPrivacy });
      setCurrentPost(updatedPost);
      setShowPrivacyModal(false);
      toast.success(`Post privacy updated to ${newPrivacy}`);
    } catch (error) {
      toast.error("Failed to update privacy settings");
    }
  };

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case 'public': return 'Globe';
      case 'friends': return 'Users';
      case 'private': return 'Lock';
      default: return 'Globe';
    }
  };

  const getPrivacyColor = (privacy) => {
    switch (privacy) {
      case 'public': return 'text-green-500';
      case 'friends': return 'text-blue-500';
      case 'private': return 'text-gray-500';
      default: return 'text-green-500';
    }
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
              src={currentPost.author?.profilePicture} 
              alt={currentPost.author?.displayName}
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
                {currentPost.author?.displayName || "Unknown User"}
              </h4>
              <p className="text-sm text-gray-500 font-body">
                @{currentPost.author?.username || "unknown"}
              </p>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handlePrivacyClick}
              className={cn(
                "flex items-center space-x-1 text-sm font-body transition-colors hover:opacity-75",
                getPrivacyColor(currentPost.privacy)
              )}
              title={`Privacy: ${currentPost.privacy}`}
            >
              <ApperIcon name={getPrivacyIcon(currentPost.privacy)} size={16} />
            </button>
            <div className="text-sm text-gray-500 font-body">
              {formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })}
            </div>
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
            onClick={() => onComment ? onComment(post.Id) : setShowComments(!showComments)}
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
{showComments && !onComment && (
        <div className="border-t border-gray-50 p-6 bg-gray-50">
          <div className="space-y-4">
            <div className="text-sm text-gray-500 font-body">
              Click on the post to view and add comments.
            </div>
          </div>
</div>
      )}

      {/* Privacy Settings Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-semibold text-gray-900">
              Privacy Settings
            </h3>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              {[
                {
                  value: 'public',
                  icon: 'Globe',
                  label: 'Public',
                  description: 'Anyone can see this post',
                  color: 'text-green-500'
                },
                {
                  value: 'friends',
                  icon: 'Users',
                  label: 'Friends',
                  description: 'Only your friends can see this post',
                  color: 'text-blue-500'
                },
                {
                  value: 'private',
                  icon: 'Lock',
                  label: 'Private',
                  description: 'Only you can see this post',
                  color: 'text-gray-500'
                }
              ].map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    currentPost.privacy === option.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <input
                    type="radio"
                    name="privacy"
                    value={option.value}
                    checked={currentPost.privacy === option.value}
                    onChange={(e) => setCurrentPost({ ...currentPost, privacy: e.target.value })}
                    className="sr-only"
                  />
                  <div className={cn("flex-shrink-0 mt-0.5", option.color)}>
                    <ApperIcon name={option.icon} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-500 font-body">
                      {option.description}
                    </div>
                  </div>
                  {currentPost.privacy === option.value && (
                    <div className="flex-shrink-0 text-primary">
                      <ApperIcon name="Check" size={20} />
                    </div>
                  )}
                </label>
              ))}
            </div>

            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowPrivacyModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handlePrivacyUpdate(currentPost.privacy)}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
</div>
        </motion.div>
      </div>
    )}
    </motion.div>
  );
};

export default PostCard;