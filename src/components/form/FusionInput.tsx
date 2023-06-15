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
    <input type="text" value={currentInput} onChange={handleChange} />
  );
}

export default FusionInput;