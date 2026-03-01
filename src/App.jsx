import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Museo from "./pages/Museo"; 
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* pública */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* museo protegido */}
        <Route
          path="/museo"
          element={
            <ProtectedRoute>
              <Museo />
            </ProtectedRoute>
          }
        />

        {/* admin protegido */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;