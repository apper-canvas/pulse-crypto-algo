import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="text-center space-y-8 max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* 404 Visual */}
          <div className="relative">
            <div className="text-8xl font-display font-bold text-gradient-coral">
              404
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full flex items-center justify-center"
            >
              <ApperIcon name="Search" size={24} className="text-secondary" />
            </motion.div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 font-body leading-relaxed">
              Looks like you've wandered off the beaten path. The page you're looking for doesn't exist.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={() => navigate("/")}
              className="w-full sm:w-auto"
            >
              <ApperIcon name="Home" size={18} className="mr-2" />
              Go Home
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
            >
              <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
              Go Back
            </Button>
          </div>

          {/* Help Links */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-body mb-4">
              Need help? Try these popular pages:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Your Profile
              </button>
              <button
                onClick={() => navigate("/messages")}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Messages
              </button>
              <button
                onClick={() => navigate("/notifications")}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Notifications
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;