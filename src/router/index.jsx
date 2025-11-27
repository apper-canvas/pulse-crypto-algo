import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

// Layout
const Layout = lazy(() => import("@/components/organisms/Layout"));

// Pages
const Home = lazy(() => import("@/components/pages/Home"));
const Profile = lazy(() => import("@/components/pages/Profile"));
const Messages = lazy(() => import("@/components/pages/Messages"));
const Notifications = lazy(() => import("@/components/pages/Notifications"));
const PostDetail = lazy(() => import("@/components/pages/PostDetail"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Main routes
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Home />
      </Suspense>
    )
  },
  {
    path: "profile",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Profile />
      </Suspense>
    )
  },
  {
    path: "profile/:userId",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Profile />
      </Suspense>
    )
  },
  {
    path: "messages",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Messages />
      </Suspense>
    )
  },
  {
    path: "notifications",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Notifications />
      </Suspense>
    )
  },
  {
    path: "post/:postId",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PostDetail />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    )
  }
];

// Router configuration
const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Layout />
      </Suspense>
    ),
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);