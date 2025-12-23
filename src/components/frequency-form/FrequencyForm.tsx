"use client";

import { useState, useCallback } from "react";
import SelectItemForm, {
  type SelectItem,
} from "../../components/select-item-form/SelectItemForm";
import { type Frequencia } from "../../schemas/schemas";
import { useTarefasManagementStore } from "../../stores/useTarefasManagementStores";

import style from "./style.module.css";

const selectItems: SelectItem[] = [
  { id: "diaria", descricao: "Diária" },
  { id: "semanal", descricao: "Semanal" },
  { id: "mensal", descricao: "Mensal" },
  { id: "trimestral", descricao: "Trimestral" },
  { id: "semestral", descricao: "Semestral" },
  { id: "anual", descricao: "Anual" },
];

export default function FrequencyForm() {
  const { setFrequenciaFilter } = useTarefasManagementStore();
  const [selectedFrequencia, setSelectedFrequencia] =
    useState<Frequencia | null>(null);

  const handleFrequenciaChange = useCallback(
    (frequencia: Frequencia | null) => {
      setSelectedFrequencia(frequencia);
      setFrequenciaFilter(frequencia);
    },
    [setFrequenciaFilter]
  );

  const DayleyOptions = () => {
    return <div>Opções Diárias</div>;
  };

  const WeeklyOptions = () => {
    return <div>Opções Semanais</div>;
  };

  const MonthlyOptions = () => {
    return <div>Opções Mensais</div>;
  };

  return (
    <div className={style.aside}>
      <div
        style={{
          width: "auto",
        }}
      >
        <SelectItemForm
          label="Frequência"
          items={selectItems}
          disabled={false}
          onChange={(item) => {
            // When the selection changes, we extract the `id` (which is our Frequencia value)
            // and pass it to the parent's state setter.
            handleFrequenciaChange(item ? (item.id as Frequencia) : null);
          }}
          required
          // The `value` prop must be the full item object, not just the string value.
          value={{
            descricao: selectedFrequencia || "",
            id: selectedFrequencia || "",
          }}
          placeholder="Selecione a frequência"
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        {/* The conditional rendering now correctly checks the primitive string value */}
        {selectedFrequencia === "diaria" && <DayleyOptions />}
        {selectedFrequencia === "semanal" && <WeeklyOptions />}
        {selectedFrequencia === "mensal" && <MonthlyOptions />}
      </div>
    </div>
  );
}
