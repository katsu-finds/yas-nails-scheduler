import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import BookAppointment from "./pages/BookAppointment";
import CalendarSchedule from "./pages/CalendarSchedule";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Appointments from "./pages/admin/Appointments";
import GalleryManagement from "./pages/admin/GalleryManagement";
import Payments from "./pages/admin/Payments";
import UserManagement from "./pages/admin/UserManagement";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
            <Route path="/calendar" element={<CalendarSchedule />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/appointments" element={<AdminLayout><Appointments /></AdminLayout>} />
            <Route path="/admin/gallery" element={<AdminLayout><GalleryManagement /></AdminLayout>} />
            <Route path="/admin/payments" element={<AdminLayout><Payments /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
