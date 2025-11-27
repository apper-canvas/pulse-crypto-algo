import React from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import NavigationTabs from "@/components/molecules/NavigationTabs";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Layout = () => {
  const location = useLocation();

  const navigationItems = [
    { path: "/", icon: "Home", label: "Home" },
    { path: "/messages", icon: "MessageCircle", label: "Messages" },
    { path: "/notifications", icon: "Bell", label: "Notifications" },
    { path: "/profile", icon: "User", label: "Profile" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header Navigation */}
      <header className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-coral rounded-lg flex items-center justify-center">
                <ApperIcon name="Heart" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-gradient-coral">
                Pulse
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:text-primary hover:bg-primary/5"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <ApperIcon 
                        name={item.icon} 
                        size={20}
                        fill={isActive ? "currentColor" : "none"}
                      />
                      <span className="font-body">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <ApperIcon name="Search" size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <ApperIcon name="Settings" size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-coral rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-gradient-coral">
              Pulse
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-primary rounded-lg transition-colors">
              <ApperIcon name="Search" size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-primary rounded-lg transition-colors">
              <ApperIcon name="Settings" size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16 lg:pb-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <NavigationTabs />
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
      />
    </div>
  );
};

export default Layout;