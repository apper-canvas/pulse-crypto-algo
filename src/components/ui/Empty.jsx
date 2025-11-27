import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Users", 
  title = "Nothing here yet", 
  description = "Get started by connecting with friends and sharing your moments.",
  actionText = "Discover People",
  onAction 
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} size={48} className="text-primary" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-display font-semibold text-gray-900">
            {title}
          </h3>
          <p className="text-gray-600 font-body text-lg leading-relaxed">
            {description}
          </p>
        </div>
        
        {onAction && actionText && (
          <button
            onClick={onAction}
            className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-coral text-white rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <ApperIcon name="Plus" size={18} />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;