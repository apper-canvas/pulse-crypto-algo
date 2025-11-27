import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import ProfileHeader from "@/components/molecules/ProfileHeader";
import ProfileEdit from "@/components/molecules/ProfileEdit";
import PostCard from "@/components/molecules/PostCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { usersService } from "@/services/api/usersService";
import { postsService } from "@/services/api/postsService";
const Profile = () => {
  const { userId } = useParams();
const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [editMode, setEditMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const isOwnProfile = !userId || userId === currentUser?.Id?.toString();

useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUserData = await usersService.getCurrentUser();
      setCurrentUser(currentUserData);
      
      const targetUserId = userId || currentUserData.Id;
      const [userData, userPosts] = await Promise.all([
        usersService.getById(parseInt(targetUserId)),
        postsService.getByUserId(parseInt(targetUserId))
      ]);
      
      setUser(userData);
      setPosts(userPosts);
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId, isFollowing) => {
    console.log(`${isFollowing ? "Following" : "Unfollowing"} user ${userId}`);
    // Follow logic handled in ProfileHeader
  };

const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      setSaveLoading(true);
      
      // Update the user profile
      const updatedUser = await usersService.update(user.Id, updatedData);
      
      // Update local state
      setUser(updatedUser);
      
      // If this is the current user, update currentUser state too
      if (user.Id === currentUser.Id) {
        setCurrentUser(updatedUser);
      }
      
      setEditMode(false);
      toast.success('Profile updated successfully!');
      
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const tabs = [
    { id: "posts", label: "Posts", icon: "Grid3X3" },
    { id: "media", label: "Media", icon: "Image" },
    { id: "about", label: "About", icon: "Info" }
  ];

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={loadData} />;

return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
{/* Profile Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header or Edit Form */}
        {editMode ? (
          <ProfileEdit
            user={user}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
            loading={saveLoading}
          />
        ) : (
          <ProfileHeader
            user={user}
            isOwnProfile={isOwnProfile}
            onEdit={handleEdit}
            editMode={editMode}
          />
        )}

        {/* Posts Section - Only show when not in edit mode */}
        {!editMode && (
          <>
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === "posts"
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Posts ({posts.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === "about"
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    About
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "posts" ? (
                  posts.length > 0 ? (
                    <div className="space-y-6">
                      {posts.map((post, index) => (
                        <motion.div
                          key={post.Id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <PostCard post={post} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <Empty
                      title="No posts yet"
                      description={
                        isOwnProfile
                          ? "You haven't shared any thoughts yet. Start posting to share your ideas with the community!"
                          : `${user?.displayName} hasn't posted anything yet.`
                      }
                      action={
                        isOwnProfile
                          ? {
                              label: "Create your first post",
                              onClick: () => console.log("Navigate to create post")
                            }
                          : null
                      }
                    />
                  )
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                      <p className="text-gray-600">
                        {user?.bio || "No bio available"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Joined</h4>
                      <p className="text-gray-600">
                        {user?.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long'
                            })
                          : 'Recently'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;