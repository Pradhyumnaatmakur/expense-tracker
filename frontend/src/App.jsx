import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const { data: user } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        headers: { "Content-type": "application/json" },
        credentials: "include",
      });

      if (res.status === 401 || res.status === 404) {
        return null;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    },
  });

  return (
    <div>
      <Header user={user} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
