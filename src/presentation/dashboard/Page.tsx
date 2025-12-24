import { useEffect, useState } from "react";

import { useAppStore } from "../../stores/useAppStore";
import { useAuthStore } from "../../stores/useAuthStore";

import style from "./style.module.css";

import SlideInEffect from "../../animations/slide-in/SlideInEffect";
import PageTitle from "../../components/page-title/PageTitle";
import NewItemButton from "../../components/new-item-button/NewItemButton";
import Loader from "../../components/loader/Loader";
import Table from "../../components/table/Table";

export default function DashboardPage() {
  const colaborador = useAuthStore((state) => state.colaborador);

  const [isInitializing, setIsInitializing] = useState(true);

  // Initial data fetch - runs once on app mount
  useEffect(() => {
    const initializeApp = async () => {
      setIsInitializing(true);

      try {
        console.log("Initializing application data...");
        // Fetch all critical data in parallel
        const promises = [useAppStore.getState().fecthInitData()];

        await Promise.all(promises);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load application data";
        console.error("App initialization error:", errorMessage);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []); // Runs once on mount

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <Loader
        message="Carregando dados da aplicação..."
        size={100}
        overlayOpacity={0.8}
      />
    );
  }

  return (
    <SlideInEffect duration={0.5}>
      <div className={style.content}>
        <header className="flex flex-row items-center justify-between w-auto p-4 h-28">
          <PageTitle
            title="Registro de Condições Inseguras"
            subtitle={`Olá, ${colaborador?.first_name}.`}
          />
          <NewItemButton label="Novo RCI" alt="Adicionar novo RCI">
            <div></div>
          </NewItemButton>
        </header>
        <main className={style.main}>
          <Table />
        </main>
      </div>
    </SlideInEffect>
  );
}
