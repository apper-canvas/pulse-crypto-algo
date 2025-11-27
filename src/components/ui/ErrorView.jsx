import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ error, onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="AlertCircle" size={40} className="text-error" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-display font-semibold text-gray-900">
            Something went wrong
          </h3>
          <p className="text-gray-600 font-body">
            {error || "We couldn't load your content. Please try again."}
          </p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-coral text-white rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <ApperIcon name="RefreshCw" size={18} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;