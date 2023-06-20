import React, { useState, useEffect } from 'react';

import FusionInput from './form/FusionForm';
import FusionTable from './table/FusionTable';

import './App.css';
import { FusionFilters, PokemonDataEntry, getAllPokemonData, getFullyEvolvedNames } from '../data/data';

const PIF_URL = "https://www.pokecommunity.com/showthread.php?t=347883";
const PIF_DISCORD_ART_URL = "https://discord.com/invite/2yynWRvBrB";
const AEGIDE_URL = "https://github.com/Aegide";
const JAPEAL_URL = "https://japeal.com/pkm/";


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

  if (pokeData === null || fullyEvolvedList === null) {
    return <>Loading...</>;
  }

  return (
    <div id="app-container">
      <div id="info-and-input-panel">
        <Title />

        <Info />

        <hr className="section-break" />

        <FusionInput
          currentMon={currentMon}
          setCurrentMon={setCurrentMon}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div id="fusion-table-panel">
        <FusionTable
          currentMon={currentMon}
          filters={filters}
          
          pokeData={pokeData}
          fullyEvolvedList={fullyEvolvedList}
          />
      </div>
    </div>
  );
}

const Title: React.FC = () => {
  return <h1 id="app-title">Infinite Fusion Search Tool</h1>;
}

const Info: React.FC = () => {
  return (
    <div id="app-info">
      <p>
        A comprehensive search tool
        for <a href={PIF_URL}>Pokémon Infinite Fusion</a> v5 sprites,
        stats, and more. Enter one Pokémon of interest to see all its potential
        fusions, then filter and sort by whatever you want. All filters are
        optional.
      </p>
      <p>
        All credit for custom sprites goes to the original artists/spriters. The
        appropriate attribution can be found both in-game and in
        the <a href={PIF_DISCORD_ART_URL}>Infinite Fusion
        Discord</a>. Thanks
        to <a href={AEGIDE_URL}>Aegide</a> for maintaining a
        sprite database and API, and
        to <a href={JAPEAL_URL}>Japeal</a> for all autogen sprites.
      </p>
      <p>
        Please contact me on either GitHub or Discord (@irinya) with any
        questions or issues.
      </p>
    </div>
  )
}

export default App;