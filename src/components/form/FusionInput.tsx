import React, { useState } from "react";
import {
  POKE_NAME_TO_ID,
} from "../../data/data";
import capitalize from "../shared/capitalize";

const POKE_NAMES = Array.from(POKE_NAME_TO_ID.keys());

interface FusionInputProps {
  isFormEnabled: boolean;
  currentMon: string | undefined;
  currentInput: string;
  setCurrentInput: React.Dispatch<React.SetStateAction<string>>;
  triggerSubmitWithName: (name: string) => void;
}
const FusionInput: React.FC<FusionInputProps> = (props) => {
  const { isFormEnabled, currentMon, triggerSubmitWithName } = props;
  const { currentInput, setCurrentInput } = props;
  const [ autocompleteList, setAutocompleteList ] = useState<Array<string> | false>(false);
  const [ activeAutocomplete, setActiveAutocomplete ] = useState<number>(0);
  const [ inputIsFocused, setInputIsFocused ] = useState<boolean>(false);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isFormEnabled) {
      return;
    }

    setInputIsFocused(true);
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isFormEnabled) {
      return;
    }

    setInputIsFocused(false);
    setActiveAutocomplete(0);
  }

  const handleChangeWithAutocomplete = (e: React.FormEvent<HTMLInputElement>) => {
    if (!isFormEnabled) {
      return;
    }

    const input = e.currentTarget.value;
    setCurrentInput(input);
    setActiveAutocomplete(0);

    if (input.length < 2) {
      setAutocompleteList(false);
      return;
    }

    setAutocompleteList(POKE_NAMES.filter(n => (
      n.indexOf(input.toLowerCase()) > -1
    )));
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isFormEnabled) {
      return;
    }

    if (!inputIsFocused) {
      return;
    }

    if (!autocompleteList || !autocompleteList.length) {
      return;
    }
    
    const keyPress = e.code;
    const KEY_UP = "ArrowUp";
    const KEY_DOWN = "ArrowDown";
    const KEY_ENTER = "Enter";

    // User pressed Enter while in the autocomplete menu. We ignore the case
    // where the user's in the input box, since pressing Enter there should just 
    // submit the search request.
    if (keyPress === KEY_ENTER && activeAutocomplete !== 0) {
      e.preventDefault(); // prevent premature form submission
      if (autocompleteList) {
        const name = autocompleteList[activeAutocomplete - 1];
        setSelectedPokemon(capitalize(name));
      }
      return;
    }

    // User pressed Up while in the autocomplete menu. We ignore the case where
    // the user's in the input box, since pressing Up there should do nothing.
    if (keyPress === KEY_UP && activeAutocomplete !== 0) {
      e.preventDefault(); // prevent cursor movement in input box
      setActiveAutocomplete(i => i - 1);
      return;
    }
 
    // User pressed Down
    if (keyPress === KEY_DOWN) {
      e.preventDefault(); // prevent cursor movement in input box

      // Do nothing if we're already at the end of the list
      if (autocompleteList && activeAutocomplete !== autocompleteList.length) {
        setActiveAutocomplete(i => i + 1);
      } 
      return;
    }
  }

  const handleAutocompleteClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!isFormEnabled) {
      return;
    }

    const name = e.currentTarget.innerText;
    setSelectedPokemon(name);
  }

  const setSelectedPokemon = (name: string) => {
    setInputIsFocused(false);
    setAutocompleteList(false);
    setActiveAutocomplete(0);
    setCurrentInput(name);
    triggerSubmitWithName(name);
  }

  return (
    <div
      id="input-container"
      tabIndex={0}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      onKeyDown={handleKeyDown}
    >
      <input
        type="text"
        id="primary-fusion-input"
        value={currentInput}
        onChange={handleChangeWithAutocomplete}
      />
      <Autocomplete
        currentMon={currentMon}
        currentInput={currentInput}
        activeAutocomplete={activeAutocomplete}

        autocompleteList={autocompleteList}
        handleAutocompleteClick={handleAutocompleteClick}
        isInputFocused={inputIsFocused}
      />
    </div>
  );
}

interface AutocompleteProps {
  currentMon: string | undefined;
  currentInput: string;
  activeAutocomplete: number;

  autocompleteList: Array<string> | false;
  handleAutocompleteClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  isInputFocused: boolean;
}
const Autocomplete: React.FC<AutocompleteProps> = (props) => {
  const { currentMon, currentInput, activeAutocomplete } = props;
  const { autocompleteList, handleAutocompleteClick, isInputFocused } = props;

  if (!isInputFocused) {
    return null;
  }

  if (!autocompleteList) {
    return null;
  }

  if (autocompleteList.length === 0) {
    return (
      <div id="autocomplete-container" className="autocomplete-none-found">
        Invalid Pokémon
      </div>
    );
  }

  if (currentMon === currentInput.toLowerCase()) {
    return null;
  }

  return (
    <div id="autocomplete-container" className="autocomplete-with-results">
      {
        autocompleteList.map((ac, i) => (
          <div
            id={(activeAutocomplete === i + 1) ? "active-autocomplete" : undefined}
            className="autocomplete-entry"
            onMouseDown={handleAutocompleteClick}
          >
            {ac}
          </div>
        ))
      }
    </div>
  );
}

export default FusionInput;