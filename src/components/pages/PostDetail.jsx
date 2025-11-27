import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PostCard from "@/components/molecules/PostCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import CommentForm from "@/components/molecules/CommentForm";
import CommentList from "@/components/molecules/CommentList";
import { postsService } from "@/services/api/postsService";
import { usersService } from "@/services/api/usersService";
const PostDetail = () => {
const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentRefresh, setCommentRefresh] = useState(0);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
}, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const [postData, currentUserData] = await Promise.all([
        postsService.getById(parseInt(postId)),
        usersService.getCurrentUser()
      ]);
      
      setPost(postData);
      setCurrentUser(currentUserData);
    } catch (err) {
      setError(err.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = async (newComment) => {
    try {
      // Update post comment count
      await postsService.addComment(postId);
      
      // Refresh post data to get updated comment count
      const updatedPost = await postsService.getById(parseInt(postId));
      setPost(updatedPost);
      
      // Trigger comment list refresh
      setCommentRefresh(prev => prev + 1);
    } catch (err) {
      console.error('Failed to update comment count:', err);
    }
};

  const handleLikePost = async (postId, isLiked) => {
    console.log(`Post ${postId} ${isLiked ? "liked" : "unliked"}`);
  };
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={loadPost} />;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Back Button */}
      <motion.button
        onClick={handleBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        whileHover={{ x: -4 }}
      >
        <ApperIcon name="ArrowLeft" size={20} />
        <span className="font-body font-medium">Back</span>
      </motion.button>

      {/* Post */}
      {post && (
        <PostCard
          post={post}
          currentUser={currentUser}
          onLike={handleLikePost}
        />
      )}
{/* Comments Section */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-display font-semibold text-gray-900">
            Comments ({post.commentCount || 0})
          </h3>
        </div>
        
        {currentUser && (
          <CommentForm
            postId={postId}
            currentUser={currentUser}
            onCommentAdded={handleCommentAdded}
          />
        )}
        
        <div className="p-6">
          <CommentList
            postId={postId}
            refreshTrigger={commentRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;