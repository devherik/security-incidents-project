import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Loader from "./components/loader/Loader";

import { useAuthStore } from "./stores/useAuthStore";

const Login = lazy(() => import("./presentation/login/Page"));

function App() {
  useEffect(() => {
    // Hydrate auth ONCE on mount
    useAuthStore.getState().hydrate();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
