import { Toaster } from "@/components/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Trace from "./pages/Trace.jsx";
import RequireAuth from "@/components/auth/RequireAuth.jsx";
import { useEffect } from "react";
import { getAccessToken, clearAuth } from "@/lib/authStorage.js";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const isLogoutRedirect = params.get("logout") === "1";

  // When coming from Trace logout (?logout=1), clear session and show signup/login home
  useEffect(() => {
    if (isLogoutRedirect) {
      clearAuth();
      navigate("/", { replace: true });
    }
  }, [isLogoutRedirect, navigate]);

  if (isLogoutRedirect) return <Index />;
  const token = getAccessToken();
  if (token) return <Navigate to="/trace" replace />;
  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/trace"
            element={
              <RequireAuth>
                <Trace />
              </RequireAuth>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
