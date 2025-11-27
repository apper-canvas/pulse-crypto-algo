import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavigationTabs = ({ className }) => {
  const tabs = [
    { path: "/", icon: "Home", label: "Home" },
    { path: "/messages", icon: "MessageCircle", label: "Messages" },
    { path: "/notifications", icon: "Bell", label: "Notifications" },
    { path: "/profile", icon: "User", label: "Profile" }
  ];

  return (
    <nav className={cn("bg-white border-t border-gray-200", className)}>
      <div className="flex">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors duration-200",
                isActive
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              )
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="mb-1"
                >
                  <ApperIcon 
                    name={tab.icon} 
                    size={20}
                    fill={isActive ? "currentColor" : "none"}
                  />
                </motion.div>
                <span className="font-body">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTabs;