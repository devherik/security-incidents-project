import { use, useEffect, useState } from "react";

import { useAppStore } from "../../stores/useAppStore";
import { useRcisStore } from "../../stores/useRcisStore";
import { useAuthStore } from "../../stores/useAuthStore";

import style from "./style.module.css";

import SlideInEffect from "../../animations/slide-in/SlideInEffect";
import PageTitle from "../../components/page-title/PageTitle";
import NewItemButton from "../../components/new-item-button/NewItemButton";
import Loader from "../../components/loader/Loader";

// import usePermissions from "../../hooks/usePermissions";

export default function DashboardPage() {
  const colaborador = useAuthStore((state) => state.colaborador);
  const rcis = useRcisStore((state) => state.filteredRcis);
  //   const { hasGroup } = usePermissions();

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

  useEffect(() => {
    const fetchRcisData = async () => {
      if (colaborador) {
        try {
          await useRcisStore.getState().fetchRcis(colaborador.id.toString());
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load RCI data";
          console.error("RCI data fetch error:", errorMessage);
        }
      }
    };

    fetchRcisData();
  }, [colaborador]);

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
            title="Minhas Tarefas"
            subtitle={`Olá, ${colaborador?.first_name}.`}
          />
          <NewItemButton label="Novo RCI" alt="Adicionar novo RCI">
            <div className="flex flex-col">
              {rcis.length > 0 ? (
                rcis.map((rci) => (
                  <span key={rci.id}>
                    RCI #{rci.id} - {rci.condicao_inseguranca.nome}
                  </span>
                ))
              ) : (
                <span>Você não tem RCIs.</span>
              )}
            </div>
          </NewItemButton>
        </header>
        <main>
          <div></div>
        </main>
      </div>
    </SlideInEffect>
  );
}
