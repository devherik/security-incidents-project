import { useCallback, useEffect, useRef } from "react";

import { useAppStore } from "../../stores/useAppStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNotificacaoStore } from "../../stores/useNotificacaoStore";

import style from "./style.module.css";

import rciLogo from "../../assets/logos/logo_rci.png";

import usePermissions from "../../hooks/usePermissions";

import SlideInEffect from "../../animations/slide-in/SlideInEffect";
import PageTitle from "../../components/page-title/PageTitle";
import NewItemButton from "../../components/new-item-button/NewItemButton";
import Loader from "../../components/loader/Loader";
import Table from "../../components/table/Table";
import NovoRci from "./NovoRci";
import UserButton from "../../components/user-btn/UserButton";
import ExcelExportButton from "../../components/excel-export-button/ExcelExportButton";

export default function DashboardPage() {
  const colaborador = useAuthStore((state) => state.colaborador);
  const isInitialized = useAppStore((state) => state.isInitialized);
  const isFetchingRef = useRef(false);

  const { hasGroup } = usePermissions();

  // Stable fetch function with error handling and deduplication
  const fetchUserNotifications = useCallback(async () => {
    if (!colaborador || isFetchingRef.current) return;

    isFetchingRef.current = true;
    try {
      await useNotificacaoStore.getState().fetchNotificacoes(colaborador.id);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      isFetchingRef.current = false;
    }
  }, [colaborador]);

  // Trigger initialization on mount - store handles idempotency
  useEffect(() => {
    useAppStore.getState().fecthInitData();
  }, []);

  // Unified effect: fetch immediately on mount, then poll every minute
  useEffect(() => {
    if (!colaborador) return;

    // Initial fetch
    fetchUserNotifications();

    // Set up polling interval
    const intervalId = setInterval(fetchUserNotifications, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [colaborador, fetchUserNotifications]);

  // Show loading screen during first-time initialization only
  if (!isInitialized) {
    return (
      <Loader
        message="Carregando dados da aplicação..."
        size={100}
        overlayOpacity={0.8}
      />
    );
  }

  return (
    <div className={style.content}>
      <SlideInEffect duration={0.5}>
        <header className="flex flex-row items-center justify-between w-auto p-4 h-28">
          <div className="flex flex-row items-center gap-4">
            <img className={style.logoRci} src={rciLogo} alt="RCI Logo" />
            <PageTitle
              title=""
              subtitle={`Olá, ${colaborador?.first_name}.`}
            />
          </div>
          <div className="flex flex-row items-center gap-4">
            {!hasGroup(1) && <ExcelExportButton />}
            <NewItemButton label="Novo RCI" alt="Adicionar novo RCI">
              <NovoRci />
            </NewItemButton>
            <UserButton />
          </div>
        </header>
        <main className={style.main}>
          <Table />
        </main>
      </SlideInEffect>
    </div>
  );
}
