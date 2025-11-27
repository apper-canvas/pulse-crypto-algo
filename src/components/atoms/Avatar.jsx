import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = ({ 
  src, 
  alt = "User avatar", 
  size = "md", 
  className,
  showRing = false,
  online = false 
}) => {
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8", 
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20"
  };
  
  const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    "2xl": 40
  };

  return (
    <div className={cn("relative", className)}>
      <div 
        className={cn(
          "rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center",
          sizes[size],
          showRing && "ring-3 ring-primary ring-opacity-50"
        )}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
          />
        ) : (
          <ApperIcon 
            name="User" 
            size={iconSizes[size]} 
            className="text-gray-500" 
          />
        )}
      </div>
      
      {online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};

export default Avatar;