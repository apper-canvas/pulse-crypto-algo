import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { commentsService } from '@/services/api/commentsService';
import { usersService } from '@/services/api/usersService';

const CommentList = ({ postId, refreshTrigger }) => {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadComments();
  }, [postId, refreshTrigger]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [commentsData, usersData] = await Promise.all([
        commentsService.getByPostId(postId),
        usersService.getAll()
      ]);
      
      // Create users map for quick lookup
      const usersMap = {};
      usersData.forEach(user => {
        usersMap[user.Id] = user;
      });
      
      setComments(commentsData);
      setUsers(usersMap);
    } catch (err) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-error font-body">
        <ApperIcon name="AlertCircle" className="w-8 h-8 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <Empty
        icon="MessageCircle"
        title="No comments yet"
        description="Be the first to share your thoughts!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => {
        const author = users[comment.authorId];
        return (
          <motion.div
            key={comment.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex space-x-3 p-4 bg-gray-50 rounded-lg"
          >
            <Avatar
              src={author?.profilePictureUrl}
              alt={author?.name || 'User'}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-display font-medium text-gray-900 text-sm">
                  {author?.name || 'Unknown User'}
                </h4>
                <span className="text-xs text-gray-500 font-body">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {comment.editedAt && (
                  <span className="text-xs text-gray-400 font-body">
                    (edited)
                  </span>
                )}
              </div>
              <p className="text-gray-800 font-body text-sm leading-relaxed">
                {comment.content}
              </p>
              {comment.likeCount > 0 && (
                <div className="flex items-center space-x-1 mt-2">
                  <ApperIcon name="Heart" className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 font-body">
                    {comment.likeCount}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CommentList;