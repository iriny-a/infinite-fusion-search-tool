import React, { useState } from "react";

import FusionInputBox from "./FusionInput";

import { FusionFilters, POKE_NAME_TO_ID } from "../../data/data";
import FusionFilterInput from "./FusionFilterInput";

import "./FusionForm.css";


interface FusionFormProps {
  setCurrentMon: React.Dispatch<React.SetStateAction<string | undefined>>
  filters: FusionFilters;
  setFilters: React.Dispatch<React.SetStateAction<FusionFilters>>;
  resetFilters: () => void;
}
const FusionForm: React.FC<FusionFormProps> = (props) => {
  const { setCurrentMon, filters, setFilters, resetFilters } = props;
  const [ currentInput, setCurrentInput ] = useState<string>("");

  const handleSubmitPokemon = (e: React.FormEvent) => {
    e.preventDefault();

    const maybePokemon = currentInput.toLowerCase().trim();

    if (POKE_NAME_TO_ID.get(maybePokemon) === undefined) {
      alert(`No Pokemon named "${currentInput}" could be found :(`);
      return;
    }

    setCurrentMon(maybePokemon);
  }

  const handleResetFilters = (e: React.FormEvent) => {
    e.preventDefault();
    resetFilters()
  }

  return (
    <div>
      <div id="primary-input-form">
        <form onSubmit={handleSubmitPokemon}>
          <FusionInputBox
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
          />
          <input type="submit" value="Search!" />
        </form>
      </div>

      <FusionFilterInput
        filters={filters}
        setFilters={setFilters}
      />

      <div id="reset-filters-form">
        <form onSubmit={handleResetFilters}>
          <input type="submit" value="Reset filters" />
        </form>
      </div>
    </div>
  );
}

export default FusionForm;