import { useAppStore } from "../../stores/useAppStore";
import { useRcisStore } from "../../stores/useRcisStore";

import SelectItemForm from "../select-item-form/SelectItemForm";

export default function Filters() {
  const filters = useRcisStore((state) => state.filters);
  const setFilter = useRcisStore((state) => state.setFilter);
  const clearFilters = useRcisStore((state) => state.clearFilters);

  const unidades = useAppStore((state) => state.unidades);
  const condicoesInseguras = useAppStore((state) => state.condicoesInseguras);
  const niveisDeRisco = useAppStore((state) => state.niveisDeRisco);

  return (
    <div>
      <select
        value={filters.periodo}
        onChange={(e) => setFilter("periodo", e.target.value)}
        style={{ padding: "5px" }}
      >
        <option value="Todos">Todos os períodos</option>
        <option value="Últimas 24 horas">Últimas 24 horas</option>
        <option value="Últimos 7 dias">Últimos 7 dias</option>
        <option value="Últimos 30 dias">Últimos 30 dias</option>
        <option value="Últimos 90 dias">Últimos 90 dias</option>
      </select>

      <SelectItemForm
        items={unidades.map((u) => ({ id: u.id, descricao: u.sigla }))}
        placeholder="Selecione a unidade"
        value={
          filters.unidade
            ? {
                id: filters.unidade.id,
                descricao: filters.unidade.sigla,
              }
            : null
        }
        onChange={(e) =>
          setFilter("unidade", unidades.find((u) => u.id === e?.id) || null)
        }
      />

      <SelectItemForm
        items={niveisDeRisco.map((n) => ({
          id: n.id,
          descricao: n.severidade,
        }))}
        placeholder="Selecione a severidade"
        value={
          filters.nivelRisco
            ? {
                id: filters.nivelRisco.id,
                descricao: filters.nivelRisco.severidade,
              }
            : null
        }
        onChange={(e) =>
          setFilter(
            "nivelRisco",
            niveisDeRisco.find((n) => n.id === e?.id) || null
          )
        }
      />

      <SelectItemForm
        items={condicoesInseguras.map((n) => ({
          id: n.id,
          descricao: n.nome,
        }))}
        placeholder="Selecione a ocorrência"
        value={
          filters.condicaoInsegura
            ? {
                id: filters.condicaoInsegura.id,
                descricao: filters.condicaoInsegura.nome,
              }
            : null
        }
        onChange={(e) =>
          setFilter(
            "condicaoInsegura",
            condicoesInseguras.find((c) => c.id === e?.id) || null
          )
        }
      />

      <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <input
          type="checkbox"
          checked={filters.ativo}
          onChange={(e) => setFilter("ativo", e.target.checked)}
        />
        Ativo
      </label>

      <button
        onClick={clearFilters}
        style={{ padding: "5px 10px", cursor: "pointer" }}
      >
        Limpar Filtros
      </button>
    </div>
  );
}
