import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom"; 
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth"; 
import { toast } from "sonner"; 

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Articles from "./pages/admin/Articles";
import ArticleForm from "./pages/admin/ArticleForm";
import ArticleView from "./pages/admin/ArticleView";
import { CategoriesList, CategoryForm } from "./pages/admin/Categories";
import { UsersList, UserForm, Profile } from "./pages/admin/Users";
import { VideosList, VideoForm, VideoCategories } from "./pages/admin/Videos";
import LiveTV from "./pages/admin/LiveTV";
import Messages from "./pages/admin/Messages";
import Notifications from "./pages/admin/Notifications";
import Settings from "./pages/admin/Settings";
import Pages from "./pages/admin/Pages";
import Search from "./pages/admin/Search"; 

const queryClient = new QueryClient();
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8085";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  const userRole = (user.role || "editor").toLowerCase();
  
  if (!allowedRoles.includes(userRole)) {
    toast.error("एक्सेस डिनाइड! यह पेज सिर्फ एडमिन (Admin) के लिए है।");
    return <Navigate to="/admin" replace />;
  }
  
  return <Outlet />;
};

const applyThemeToDOM = (themeData: any) => {
  const root = document.documentElement;
  if (themeData.darkModeDefault) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  root.style.setProperty("--primary", themeData.primaryColor);
  root.style.setProperty("--accent", themeData.accentColor);
};

const App = () => {

  useEffect(() => {
    fetch(`${API_URL}/api/settings/current`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          applyThemeToDOM(data);
          localStorage.setItem("siteName", data.siteName || "APNO RAJASTHAN");
        }
      })
      .catch(err => console.error("Global settings load karne mein error:", err));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin", "editor"]} />}>
                <Route element={<AdminLayout />}>
                  
                  {/* 🟢 ADMIN AUR EDITOR DONO KE LIYE */}
                  <Route index element={<Dashboard />} />
                  <Route path="search" element={<Search />} />
                  
                  <Route path="articles" element={<Articles />} />
                  <Route path="articles/new" element={<ArticleForm mode="new" />} />
                  <Route path="articles/:id" element={<ArticleView />} />
                  <Route path="articles/:id/edit" element={<ArticleForm mode="edit" />} />
                  <Route path="drafts" element={<Articles draftsOnly />} />
                  
                  <Route path="categories" element={<CategoriesList />} />
                  <Route path="categories/new" element={<CategoryForm mode="new" />} />
                  <Route path="categories/:id/edit" element={<CategoryForm mode="edit" />} />
                  
                  <Route path="profile" element={<Profile />} />
                  
                  <Route path="videos" element={<VideosList />} />
                  <Route path="videos/new" element={<VideoForm mode="new" />} />
                  <Route path="videos/:id/edit" element={<VideoForm mode="edit" />} />
                  <Route path="videos/categories" element={<VideoCategories />} />
                  
                  <Route path="notifications" element={<Notifications />} />

                  {/* 🔴 SIRF ADMIN KE LIYE (Messages ko yahan daal diya) */}
                  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="users" element={<UsersList />} />
                    <Route path="users/new" element={<UserForm mode="new" />} />
                    <Route path="users/:id/edit" element={<UserForm mode="edit" />} />
                    
                    <Route path="live-tv" element={<LiveTV />} />
                    <Route path="messages" element={<Messages />} /> 
                    <Route path="settings" element={<Settings />} />
                    <Route path="pages" element={<Pages />} />
                  </Route>

                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;