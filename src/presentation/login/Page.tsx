"use client";

import { z } from "zod";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import style from "./style.module.css";

import { useAuthStore } from "../../stores/useAuthStore";
import { useAppStore } from "../../stores/useAppStore";

import CredentialForm from "../../components/credential-form/CredentialForm";
import SlideInEffect from "../../animations/slide-in/SlideInEffect";

import type { LoginCredentials } from "../../schemas/authSchemas";
import { LoginCredentialsSchema } from "../../schemas/authSchemas";

import logo from "../../assets/logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, checkSuperUser } = useAuthStore();
  const { showToast } = useAppStore();

  const [validating, setValidating] = useState<boolean>(false);
  const [superUser, setSuperUser] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });

  // Check if user is super user
  const handleCheckSuperUser = useCallback(async () => {
    if (credentials.username.length >= 11) {
      try {
        const isSuperUser = await checkSuperUser(credentials.username);
        setSuperUser(isSuperUser);
        if (!isSuperUser) {
          setCredentials((prev) => ({
            ...prev,
            password: `${credentials.username.substring(0, 6)}@@`, // Default password for non-super users
          }));
        }
      } catch (error) {
        console.error("Error checking super user status:", error);
        setSuperUser(false);
      }
    } else {
      setSuperUser(false);
    }
  }, [credentials.username, checkSuperUser]);

  const handleLogin = async () => {
    setValidating(true);
    try {
      LoginCredentialsSchema.parse(credentials);
      await login({
        username: credentials.username,
        password: credentials.password,
      })
        .then(() => {
          showToast(`Bem vindo de volta!`, "success");
          navigate("/dashboard", { replace: true });
        })
        .catch((error) => {
          showToast(
            error instanceof Error ? error.message : "Falha no login.",
            "error"
          );
        })
        .finally(() => {
          setValidating(false);
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast(
          error.issues.map((issue) => issue.message).join(", "),
          "error"
        );
        setValidating(false);
        return;
      }
      showToast("Tivemos um problema inesperado.", "error");
      setValidating(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const user = await useAuthStore.getState().getCurrentUser();
        if (user) {
          showToast(`Bem vindo de volta!`, "success");
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    checkAuthAndRedirect();
  }, [navigate, showToast]);

  // Check super user status when username changes
  useEffect(() => {
    const check = async () => {
      if (credentials.username.length >= 6) {
        await handleCheckSuperUser();
      }
    };
    check();
  }, [credentials.username, handleCheckSuperUser]);

  return (
    <SlideInEffect duration={0.5}>
      <div className={style.container}>
        <div className={style.logo}>
          <img src={logo} alt="P1 Logo" />
        </div>
        <main className={style.main}>
          <img className={style.logoRci} src={logo} alt="RCI Logo" />
          <span className={style.subtitle}>Informe suas credenciais</span>
          <CredentialForm
            id="username"
            type="text"
            label="Usuário"
            value={credentials.username}
            onChange={(value) =>
              setCredentials({ ...credentials, username: value })
            }
          />
          {superUser && (
            <CredentialForm
              id="password"
              type="password"
              label="Senha"
              value={credentials.password}
              onChange={(value) =>
                setCredentials({ ...credentials, password: value })
              }
            />
          )}
          <button
            onClick={handleLogin}
            className={style.btn}
            disabled={validating}
          >
            Entrar
          </button>
          <span className={style.support}>
            Em caso de dúvidas, contate o suporte.
          </span>
        </main>
      </div>
    </SlideInEffect>
  );
}
