import { useEffect } from "react";

import { useAppStore } from "../../stores/useAppStore";
import { useAuthStore } from "../../stores/useAuthStore";

import style from "./style.module.css";

import SlideInEffect from "../../animations/slide-in/SlideInEffect";
import PageTitle from "../../components/page-title/PageTitle";
import NewItemButton from "../../components/new-item-button/NewItemButton";
import Loader from "../../components/loader/Loader";
import Table from "../../components/table/Table";
import NovoRci from "./NovoRci";
import UserButton from "../../components/user-btn/UserButton";

export default function DashboardPage() {
  const colaborador = useAuthStore((state) => state.colaborador);
  const isInitialized = useAppStore((state) => state.isInitialized);

  // Trigger initialization on mount - store handles idempotency
  useEffect(() => {
    useAppStore.getState().fecthInitData();
  }, []);

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
    <SlideInEffect duration={0.5}>
      <div className={style.content}>
        <header className="flex flex-row items-center justify-between w-auto p-4 h-28">
          <PageTitle
            title="Registro de Condições Inseguras"
            subtitle={`Olá, ${colaborador?.first_name}.`}
          />
          <div className="flex flex-row items-center gap-4">
            <NewItemButton label="Novo RCI" alt="Adicionar novo RCI">
              <NovoRci />
            </NewItemButton>
            <UserButton />
          </div>
        </header>
        <main className={style.main}>
          <Table />
        </main>
      </div>
    </SlideInEffect>
  );
}
