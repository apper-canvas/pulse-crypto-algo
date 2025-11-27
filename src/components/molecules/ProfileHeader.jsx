import React, { useState } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ProfileHeader = ({ user, currentUser, isOwnProfile, onFollow, onEdit }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(user?.followerCount || 0);

  const handleFollow = async () => {
    if (!onFollow) return;
    
    const newFollowingState = !isFollowing;
    const newCount = newFollowingState ? followerCount + 1 : followerCount - 1;
    
    setIsFollowing(newFollowingState);
    setFollowerCount(newCount);
    
    try {
      await onFollow(user.Id, newFollowingState);
      toast.success(newFollowingState ? "Now following!" : "Unfollowed");
    } catch (error) {
      // Rollback on error
      setIsFollowing(!newFollowingState);
      setFollowerCount(followerCount);
      toast.error("Failed to update follow status");
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Cover Photo */}
      <div className="h-32 sm:h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"></div>
      
      {/* Profile Info */}
      <div className="px-6 pb-6">
        {/* Avatar and Actions */}
        <div className="flex items-end justify-between -mt-12 mb-4">
          <Avatar 
            src={user.profilePicture} 
            alt={user.displayName}
            size="2xl"
            className="border-4 border-white shadow-lg"
            showRing={true}
          />
          
          <div className="mt-12">
            {isOwnProfile ? (
              <Button variant="secondary" onClick={onEdit}>
                <ApperIcon name="Edit" size={16} className="mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button 
                variant={isFollowing ? "secondary" : "primary"}
                onClick={handleFollow}
              >
                <ApperIcon 
                  name={isFollowing ? "UserMinus" : "UserPlus"} 
                  size={16} 
                  className="mr-2" 
                />
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              {user.displayName}
            </h1>
            <p className="text-lg text-gray-600 font-body">
              @{user.username}
            </p>
          </div>

          {user.bio && (
            <p className="text-gray-700 font-body leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center space-x-6 pt-2">
            <div className="text-center">
              <div className="text-xl font-display font-bold text-gray-900">
                {followerCount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 font-body">
                Followers
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-display font-bold text-gray-900">
                {(user.followingCount || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 font-body">
                Following
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-display font-bold text-gray-900">
                {(user.postCount || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 font-body">
                Posts
              </div>
            </div>
          </div>

          {/* Join Date */}
          <div className="flex items-center space-x-2 text-gray-600 text-sm font-body pt-2">
            <ApperIcon name="Calendar" size={16} />
            <span>
              Joined {new Date(user.createdAt).toLocaleDateString("en-US", { 
                month: "long", 
                year: "numeric" 
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;