import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import Analysis from "@/pages/analysis/analysis";
import Topics from "@/pages/topics/topics";

function App() {
  const navigate = useNavigate();
  const onModeChange = (mode: "sign-in" | "sign-up") => {
    navigate(mode === "sign-in" ? "/sign-in" : "/sign-up");
  };
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn onModeChange={onModeChange} />} />
      <Route path="/sign-up" element={<SignUp onModeChange={onModeChange} />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/topics" element={<Topics />} />
      <Route path="/" element={<Navigate replace to="/sign-in" />} />
      <Route path="*" element={<Navigate replace to="/sign-in" />} />
    </Routes>
  );
}

export default App;
