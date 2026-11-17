import React from "react";

import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import MianLayout from "./Layouts/MianLayout";
import Feed from "./Pages/Feed/Feed";
import Profile from "./Pages/Profile/Profile";
import Notification from "./Pages/Notification/Notification";
import NotFound from "./Pages/NotFound/NotFound";
import { Toaster } from "react-hot-toast";
import AppProtectedRoutes from "./Components/ProtectedRoutes/AppProtectedRoutes";
import AuthProtectedRoutes from "./Components/ProtectedRoutes/AuthProtectedRoute";
import PostDetails from "./Components/PostDetails/PostDetails";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/auth",
      element:<AuthProtectedRoutes><AuthLayout /></AuthProtectedRoutes>,
      children: [
        { index: true, element: <Navigate to="login" /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
    {
      path: "",
      element: <AppProtectedRoutes><MianLayout /></AppProtectedRoutes>,
      children: [
        { index:true, element: <Navigate to="feed" /> },
        { path: "feed", element: <Feed /> },
        { path: "profile", element: <Profile /> },
        { path: "notification", element: <Notification /> },
        { path: "postDetails/:id", element: <PostDetails/> },
        { path: "*", element: <NotFound /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);
  return (
    <>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right"/>
      <RouterProvider router={routes} />
    </>
  );
}
