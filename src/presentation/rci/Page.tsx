import { useLocation, useNavigate } from "react-router-dom";

import style from "./style.module.css";

import SlideInEffect from "../../animations/slide-in/SlideInEffect";
import NavigateButton from "../../components/buttons/NavigateButton";

export default function RciPage() {
  const location = useLocation();

  const rci = location.state?.rci;

  if (!rci) {
    return (
      <div className={style.container}>
        <SlideInEffect duration={0.5}>
          <header className={style.header}>
            <NavigateButton
              direction="left"
              path="/dashboard"
              alt="Voltar para o dashboard"
            />
          </header>
          <main className={style.main}>
            <h1 className="mb-4 text-2xl font-bold">Não encontramos o RCI.</h1>
          </main>
        </SlideInEffect>
      </div>
    );
  }

  if (rci) {
    return (
      <div className={style.container}>
        <SlideInEffect duration={0.5}>
          <header className={style.header}>
            <NavigateButton
              direction="left"
              path="/dashboard"
              alt="Voltar para o dashboard"
            />
          </header>
          <main className={style.main}>
            <h1 className="mb-4 text-2xl font-bold">Detalhes do RCI</h1>
            <p>
              <strong>ID:</strong> {rci.id}
            </p>
            <p>
              <strong>Nome:</strong> {rci.name}
            </p>
            <p>
              <strong>Descrição:</strong> {rci.description}
            </p>
            {/* Adicione mais detalhes do RCI conforme necessário */}
          </main>
        </SlideInEffect>
      </div>
    );
  }
}
