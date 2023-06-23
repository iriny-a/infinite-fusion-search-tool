import React, { useState } from "react";

import FusionInput from "./FusionInput";

import { FusionFilters, POKE_NAME_TO_ID, PokemonDataEntry, TYPE_NAMES_TO_COLORS, unCosmetifyName } from "../../data/data";
import FusionFilterInput from "./FusionFilterInput";

import "./FusionForm.css";


interface FusionFormProps {
  isFormEnabled: boolean;
  setIsFormEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  currentMon: string | undefined;
  setCurrentMon: React.Dispatch<React.SetStateAction<string | undefined>>
  filters: FusionFilters;
  setFilters: React.Dispatch<React.SetStateAction<FusionFilters>>;
  resetFilters: () => void;

  pokeData: Map<string, PokemonDataEntry>;
}
const FusionForm: React.FC<FusionFormProps> = (props) => {
  const { isFormEnabled, setIsFormEnabled } = props;
  const { currentMon, setCurrentMon } = props;
  const { filters, setFilters, resetFilters, pokeData } = props;
  const [ currentInput, setCurrentInput ] = useState<string>("");

  const handleSubmitPokemon = (e: React.FormEvent) => {
    e.preventDefault();

    triggerSubmitWithName(currentInput);
  }

  const triggerSubmitWithName = (maybePokeName: string) => {
    maybePokeName = unCosmetifyName(maybePokeName.trim());
    if (POKE_NAME_TO_ID.get(maybePokeName) === undefined) {
      alert(`No Pokémon named "${maybePokeName}" could be found.`);
      return;
    }

    // The autocomplete menu lets users submit the same Pokemon repeatedly,
    // which should not affect the app.
    if (maybePokeName === currentMon) {
      return;
    }

    setCurrentMon(maybePokeName);
    setIsFormEnabled(false);
  }

  const handleResetFilters = (e: React.FormEvent) => {
    e.preventDefault();
    resetFilters()
  }

  const getStyleForInput = (): React.CSSProperties => {
    const input = unCosmetifyName(currentInput.toLowerCase());
    if (!currentMon) {
      return {};
    }

    if (input !== currentMon) {
      return {};
    }

    const dt = pokeData.get(currentMon);
    if (!dt) {
      return {};
    }

    // TODO: figure out a nice way to make a pretty background as well
    const types = dt.types;
    if (types.secondType && types.secondType !== types.firstType) {
      const firstTypeColor = TYPE_NAMES_TO_COLORS.get(types.firstType);
      const secondTypeColor = TYPE_NAMES_TO_COLORS.get(types.secondType);
      return {
        borderLeft: `solid ${firstTypeColor} 3px`,
        borderTop: `solid ${firstTypeColor} 3px`,
        borderRight: `solid ${secondTypeColor} 3px`,
        borderBottom: `solid ${secondTypeColor} 3px`,
      }
    }

    const typeColor = TYPE_NAMES_TO_COLORS.get(types.firstType);
    return {
      border: `solid ${typeColor} 3px`,
    };
  }

  return (
    <fieldset disabled={!isFormEnabled}>
      <div id="primary-input-form" style={getStyleForInput()}>
        <form onSubmit={handleSubmitPokemon}>
          <label htmlFor="primary-fusion-input">Pokémon of Interest</label>
          <br />
          <FusionInput
            isFormEnabled={isFormEnabled}
            currentMon={currentMon}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            triggerSubmitWithName={triggerSubmitWithName}
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
    </fieldset>
  );
}

export default FusionForm;