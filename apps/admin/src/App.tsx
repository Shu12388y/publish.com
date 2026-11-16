import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import Analysis from "@/pages/analysis/analysis";
import Topics from "@/pages/topics/topics";
import Audience from "@/pages/audience/audience";
import Settings from "@/pages/settings/settings";
import Campaigns from "@/pages/campaigns/campaigns";
import Content from "@/pages/content/content";
import { restoreSession } from "@/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const authStatus = useAppSelector((state) => state.auth.status);
  if (authStatus === "idle" || authStatus === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-sm text-muted-foreground">
        Restoring your session...
      </div>
    );
  }
  return user ? children : <Navigate replace to="/sign-in" />;
}

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    void dispatch(restoreSession());
  }, [dispatch]);
  const onModeChange = (mode: "sign-in" | "sign-up") => {
    navigate(mode === "sign-in" ? "/sign-in" : "/sign-up");
  };
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn onModeChange={onModeChange} />} />
      <Route path="/sign-up" element={<SignUp onModeChange={onModeChange} />} />
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/topics"
        element={
          <ProtectedRoute>
            <Topics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/audience"
        element={
          <ProtectedRoute>
            <Audience />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/campaigns"
        element={
          <ProtectedRoute>
            <Campaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/content"
        element={
          <ProtectedRoute>
            <Content />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate replace to="/sign-in" />} />
      <Route path="*" element={<Navigate replace to="/sign-in" />} />
    </Routes>
  );
}

export default App;
