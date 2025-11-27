import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import { commentsService } from '@/services/api/commentsService';

const CommentForm = ({ postId, currentUser, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (content.length > 280) {
      toast.error('Comment cannot exceed 280 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newComment = await commentsService.create({
        postId: parseInt(postId),
        authorId: currentUser.Id,
        content: content.trim()
      });

      setContent('');
      toast.success('Comment added successfully!');
      
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = 280 - content.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-100 p-4"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-3">
          <Avatar
            src={currentUser?.profilePictureUrl}
            alt={currentUser?.name || 'User'}
            size="sm"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors font-body text-sm"
              rows={2}
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between mt-2">
              <span 
                className={`text-xs font-body ${
                  remainingChars < 20 ? 'text-error' : 'text-gray-500'
                }`}
              >
                {remainingChars} characters remaining
              </span>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !content.trim() || content.length > 280}
                className="px-4 py-1.5"
              >
                {isSubmitting ? 'Adding...' : 'Comment'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CommentForm;