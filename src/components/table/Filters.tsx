import { useAppStore } from "../../stores/useAppStore";
import { useRcisStore } from "../../stores/useRcisStore";

import SelectItemForm from "../select-item-form/SelectItemForm";

import style from "./style.module.css";

export default function Filters() {
  const filters = useRcisStore((state) => state.filters);
  const setFilter = useRcisStore((state) => state.setFilter);
  const clearFilters = useRcisStore((state) => state.clearFilters);

  const unidades = useAppStore((state) => state.unidades);
  const periodos = useAppStore((state) => state.periodo);
  const condicoesInseguras = useAppStore((state) => state.condicoesInseguras);
  const niveisDeRisco = useAppStore((state) => state.niveisDeRisco);
  const status = useAppStore((state) => state.status);

  return (
    <div className={style.filtersContainer}>
      <SelectItemForm
        label="Período"
        placeholder="Selecione o período"
        items={periodos.map((p) => ({ id: p, descricao: p }))}
        value={
          filters.periodo
            ? { id: filters.periodo, descricao: filters.periodo }
            : null
        }
        onChange={(e) =>
          setFilter("periodo", periodos.find((p) => p === e?.id) || "")
        }
      />

      <SelectItemForm
        label="Unidade"
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
        label="Status"
        items={status.map((s) => ({ id: s, descricao: s }))}
        placeholder="Selecione o status"
        value={
          filters.status
            ? { id: filters.status, descricao: filters.status }
            : null
        }
        onChange={(e) =>
          setFilter("status", status.find((s) => s === e?.id) || null)
        }
      />

      <SelectItemForm
        label="Nível de Risco"
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
        label="Ocorrência"
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

      <label className={style.checkboxLabel}>
        <input
          className={style.checkboxInput}
          type="checkbox"
          checked={filters.ativo}
          onChange={(e) => setFilter("ativo", e.target.checked)}
        />
        Ativo
      </label>

      <button onClick={clearFilters} className={style.clearFiltersButton}>
        Limpar
      </button>
    </div>
  );
}
