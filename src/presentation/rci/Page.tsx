import { useLocation, useNavigate } from "react-router-dom";

export default function RciPage() {
  const location = useLocation();
  const rci = location.state?.rci;

  if (!rci) {
    return <h1>No RCI data available.</h1>;
  }

  if (rci) {
    return (
      <div>
        <h1>RCI Detail Page</h1>
        <p>
          <strong>Unidade:</strong> {rci.unidade.sigla}
        </p>
        <p>
          <strong>Nível de Risco:</strong>{" "}
          {`${rci.nivel_risco.sigla_risco} - ${rci.nivel_risco.severidade}`}
        </p>
        <p>
          <strong>Condição Insegura:</strong> {rci.condicao_insegura.nome}
        </p>
        <p>
          <strong>Autor:</strong> {rci.autor.first_name}
        </p>
        <p>
          <strong>Status:</strong> {rci.status}
        </p>
        <p>
          <strong>Link Plano de Ação:</strong> {rci.link_plano_acao}
        </p>
        <p>
          <strong>Data de Criação:</strong>{" "}
          {new Date(rci.dtcriacao).toISOString().split("T")[0]}
        </p>
      </div>
    );
  }
}
