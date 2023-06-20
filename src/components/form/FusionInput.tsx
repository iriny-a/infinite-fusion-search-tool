import React, { useState } from "react";


interface FusionInputProps {
  currentInput: string;
  setCurrentInput: React.Dispatch<React.SetStateAction<string>>;
}
const FusionInput: React.FC<FusionInputProps> = (props) => {
  const { currentInput, setCurrentInput } = props;

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCurrentInput(e.currentTarget.value);
  }

  // TOOD: add autocompletion
  return (
    <>
      <label htmlFor="primary-fusion-input">Pokémon of Interest</label>
      <br />
      <input
        type="text"
        id="primary-fusion-input"
        value={currentInput}
        onChange={handleChange}
        />
      </>
  );
}

export default FusionInput;