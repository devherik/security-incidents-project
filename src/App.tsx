import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, } from "react-router-dom";

import Loader from "./components/loader/Loader";
import Toast from "./components/toast/Toast";

import { useAuthStore } from "./stores/useAuthStore";

import ProtectedRoute from "./components/route-handlers/ProtectedRoute";

const Login = lazy(() => import("./presentation/login/Page"));
import DashboardPage from "./presentation/dashboard/Page";

function App() {
  useEffect(() => {
    // Hydrate auth ONCE on mount
    useAuthStore.getState().hydrate();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Suspense
          fallback={
            <Loader size={100} overlayOpacity={0.8} message="Carregando..." />
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toast />
    </>
  );
}

export default App;
