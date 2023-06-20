import React, { useState } from "react";

import FusionInput from "./FusionInput";

import { FusionFilters, POKE_NAME_TO_ID } from "../../data/data";
import FusionFilterInput from "./FusionFilterInput";


interface FusionFormProps {
  currentMon: string | undefined;
  setCurrentMon: React.Dispatch<React.SetStateAction<string | undefined>>
  filters: FusionFilters;
  setFilters: React.Dispatch<React.SetStateAction<FusionFilters>>;
}
const FusionForm: React.FC<FusionFormProps> = (props) => {
  const { setCurrentMon, filters, setFilters } = props;
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

  return (
    <>
      <form onSubmit={handleSubmitPokemon}>
        <FusionInput
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
        />
        <input type="submit" value="hi" />
      </form>
      
      <FusionFilterInput
        filters={filters}
        setFilters={setFilters}
      />
    </>
  );
}

export default FusionForm;