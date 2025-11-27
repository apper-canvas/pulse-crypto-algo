import React, { useState } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const PostComposer = ({ user, onPost, onClose }) => {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size must be less than 10MB");
        return;
      }
      
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handlePost = async () => {
    if (!content.trim() && !mediaFile) {
      toast.error("Please add some content or media to your post");
      return;
    }

    if (content.length > 500) {
      toast.error("Post content must be 500 characters or less");
      return;
    }

    setIsPosting(true);
    
    try {
      const postData = {
        content: content.trim(),
        mediaFile,
        mediaPreview
      };
      
      await onPost(postData);
      
      // Reset form
      setContent("");
      setMediaFile(null);
      setMediaPreview(null);
      
      toast.success("Post shared successfully!");
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={user?.profilePicture} 
            alt={user?.displayName}
            size="lg"
          />
          <div>
            <h3 className="font-display font-semibold text-gray-900">
              Share a moment
            </h3>
            <p className="text-sm text-gray-500 font-body">
              What's on your mind, {user?.displayName?.split(" ")[0]}?
            </p>
          </div>
        </div>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        )}
      </div>

      {/* Content Input */}
      <div className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share what's happening in your world..."
          rows={4}
          className="w-full p-4 border-2 border-gray-200 rounded-lg font-body text-gray-900 placeholder-gray-500 resize-none focus:border-primary focus:outline-none focus:ring-0 transition-colors duration-200"
          maxLength={500}
        />
        
        <div className="flex items-center justify-between text-sm">
          <span className={`font-body ${content.length > 450 ? "text-error" : "text-gray-500"}`}>
            {content.length}/500 characters
          </span>
        </div>
      </div>

      {/* Media Preview */}
      {mediaPreview && (
        <div className="relative">
          {mediaFile.type.startsWith("image/") ? (
            <img 
              src={mediaPreview} 
              alt="Media preview"
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <video 
              src={mediaPreview}
              controls
              className="w-full h-64 rounded-lg"
            />
          )}
          <button
            onClick={removeMedia}
            className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-secondary hover:text-secondary/80 cursor-pointer transition-colors">
            <ApperIcon name="Image" size={20} />
            <span className="text-sm font-medium">Photo/Video</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex items-center space-x-3">
          {onClose && (
            <Button variant="ghost" onClick={onClose} disabled={isPosting}>
              Cancel
            </Button>
          )}
          <Button 
            onClick={handlePost}
            disabled={isPosting || (!content.trim() && !mediaFile)}
            className="min-w-[100px]"
          >
            {isPosting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Posting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ApperIcon name="Send" size={16} />
                <span>Post</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostComposer;