import React, { useState, useEffect } from 'react';

import FusionInput from './form/FusionForm';
import FusionTable from './table/FusionTable';

import './App.css';
import { FusionFilters, PokemonDataEntry, getAllPokemonData, getFullyEvolvedNames } from '../data/data';


const App: React.FC = () => {
  const [ currentMon, setCurrentMon ] = useState<string | undefined>(undefined);
  const [ filters, setFilters ] = useState<FusionFilters>({
    customArtOnly: false,
    typeOverride: new Map<string, boolean>(),
    fullyEvolvedOnly: false,
  });
  const [ pokeData, setPokeData ] = useState<Map<string, PokemonDataEntry> | null>(null);
  const [ fullyEvolvedList, setFullyEvolvedList ] = useState<Set<string> | null>(null);

  useEffect(() => {
    (async () => {
      setPokeData(await getAllPokemonData());
      setFullyEvolvedList(await getFullyEvolvedNames());
    })();
  }, []);

  useEffect(() => {
    console.log("the new pokemon is " + currentMon);
  }, [currentMon]);

  if (pokeData === null || fullyEvolvedList === null) {
    return <>Loading...</>;
  }

  return (
    <>
      <FusionInput
        currentMon={currentMon}
        setCurrentMon={setCurrentMon}
        filters={filters}
        setFilters={setFilters}
      />

      <FusionTable
        currentMon={currentMon}
        filters={filters}
      />
    </>
  );
}

export default App;