import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const ProfileEdit = ({ user, onSave, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || '');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (formData.bio.length > 160) {
      newErrors.bio = 'Bio must be 160 characters or less';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          profilePicture: 'File size must be less than 5MB'
        }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Please select an image file'
        }));
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        profilePicture: ''
      }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      const updatedData = {
        ...formData,
        profilePicture: previewUrl
      };
      onSave(updatedData);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      username: user?.username || '',
      bio: user?.bio || '',
      profilePicture: user?.profilePicture || ''
    });
    setSelectedFile(null);
    setPreviewUrl(user?.profilePicture || '');
    setErrors({});
    onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-gradient-coral text-white"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Check" size={16} className="mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar
              src={previewUrl}
              alt={formData.displayName}
              size="xl"
              className="border-4 border-white shadow-lg"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 shadow-lg hover:bg-opacity-90 transition-colors"
            >
              <ApperIcon name="Camera" size={16} />
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="text-center">
            <p className="text-sm text-gray-600">Click the camera icon to change photo</p>
            <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG up to 5MB</p>
          </div>
          
          {errors.profilePicture && (
            <p className="text-sm text-error">{errors.profilePicture}</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <Input
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="Enter your display name"
              className={cn(
                "w-full",
                errors.displayName && "border-error focus:border-error focus:ring-error"
              )}
              disabled={loading}
            />
            {errors.displayName && (
              <p className="text-sm text-error mt-1">{errors.displayName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <Input
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter your username"
              className={cn(
                "w-full",
                errors.username && "border-error focus:border-error focus:ring-error"
              )}
              disabled={loading}
            />
            {errors.username && (
              <p className="text-sm text-error mt-1">{errors.username}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={160}
              className={cn(
                "w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none",
                errors.bio && "border-error focus:border-error focus:ring-error"
              )}
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-1">
              <div>
                {errors.bio && (
                  <p className="text-sm text-error">{errors.bio}</p>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {formData.bio.length}/160 characters
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileEdit;