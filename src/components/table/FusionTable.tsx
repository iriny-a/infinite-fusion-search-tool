import React, { useState, useEffect } from "react";

import FusionTableRow from "./FusionTableRow";

import { FusionArtURL, FusionFilters, PokeAPIRes, PokemonDataEntry, POKE_NAME_TO_ID, parsePokeAPI } from "../../data/data";
import rawFusionWorker from "./fetchFusion";

import "./FusionTable.css";


const NUMBER_OF_BASE_POKEMON = 20; // PokemonNameToId.size;
const AEGIDE_CUSTOM_URL = "https://raw.githubusercontent.com/Aegide/custom-fusion-sprites/main/CustomBattlers/";
const AEGIDE_AUTOGEN_URL = "https://raw.githubusercontent.com/Aegide/autogen-fusion-sprites/master/Battlers/";

interface FusionTableProps {
  currentMon: string | undefined;
  filters: FusionFilters;
}
const FusionTable: React.FC<FusionTableProps> = (props) => {
  const { currentMon, filters } = props;

  if (!currentMon) {
    return null;
  }

  // Mostly here just for safety; it should be impossible to reach this
  // component with an invalid pokemon.
  if (POKE_NAME_TO_ID.get(currentMon) === undefined) {
    return null;
  }

  return <FusionTableHandler
    currentMon={currentMon}
    filters={filters}
  />
}


interface FusionTableHandlerProps {
  currentMon: string;
  filters: FusionFilters;
}
const FusionTableHandler: React.FC<FusionTableHandlerProps> = (props) => {
  const { currentMon, filters } = props;
  const [ currentMonData, setCurrentMonData ] = useState<PokemonDataEntry>();
  const [ allLoaded, setAllLoaded ] = useState<boolean>(false);
  const [ fusionData, setFusionData ] = useState<PokemonDataEntry[][]>([]);
  const [ fusionDataFinal, setFusionDataFinal ] = useState<PokemonDataEntry[]>([]);

  useEffect(() => {
    setFusionData([]);
    setCurrentMonData(undefined);
  }, [currentMon]);

  useEffect(() => {
    if (fusionData.length < NUMBER_OF_BASE_POKEMON) {
      if (allLoaded) {
        setAllLoaded(false);
      }

      if (!currentMonData) {
        (async () => {
          const pokeAPIRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentMon}`);
          const pokeAPIJson = await pokeAPIRes.json();
          const currentMonParsed = parsePokeAPI(pokeAPIJson);
          setCurrentMonData(currentMonParsed);
        })();
      } else {
        (async () => {
          const inputMon = Array.from(POKE_NAME_TO_ID.keys())[fusionData.length];
          const newFusions = await getFusionData(currentMonData as PokemonDataEntry, inputMon);
          setFusionData([...fusionData, newFusions]);
        })();
      }
      return;
    }

    filterFusions();
    setAllLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonData, fusionData]);

  useEffect(() => {
    filterFusions();
  }, [filters]);

  if (!allLoaded) {
    return <FusionTableLoading count={fusionData.length} />;
  }

  return (
    <FusionTableRender
      fusionData={fusionData}
    />
  );
}

const getArtURL = async (headId: string, bodyId: string): Promise<FusionArtURL> => {
  const aegideURL = AEGIDE_CUSTOM_URL + `${headId}.${bodyId}.png`;
  const maybeAegideRes = await fetch(aegideURL);
  if (maybeAegideRes.status === 200) {
    return {
      url: aegideURL,
      isCustom: true,
    };
  }
  return {
    url: AEGIDE_AUTOGEN_URL + `${bodyId}/${bodyId}.${headId}.png`,
    isCustom: false,
  };
    
}

const getFusionData = async (baseMonData: PokemonDataEntry, inputMon: string): Promise<PokemonDataEntry[]> => {
  // First, fetch and parse data for the input mon
  const pokeAPIRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputMon}`);
  const pokeAPIJson = await pokeAPIRes.json();
  const inputMonData = parsePokeAPI(pokeAPIJson);

  // This is really, really clunky in PokeAPI for some reason... can explore a
  // better method for this later
  const pokeAPISpeciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${inputMon}`);
  const pokeAPISpeciesJson = await pokeAPISpeciesRes.json();
  const evoChainURL = pokeAPISpeciesJson.evolution_chain.url as string;
  const pokeAPIEvoChainRes = await fetch(evoChainURL);
  const pokeAPIEvoChainJson = await pokeAPIEvoChainRes.json();
  let evoChain = pokeAPIEvoChainJson.chain;
  while (true) {
    evoChain.evolves_to.forEach(evo => )
  }

  // Perform fusion in both directions
  // mostly placeholder for now, to ensure functionality
  const baseInputFusion: PokemonDataEntry = {
    ...baseMonData,
    name: `${baseMonData.name}/${inputMonData.name}`,
    artUrl: await getArtURL(baseMonData.id, inputMonData.id),
    id: `${baseMonData.id} + ${inputMonData.id}`,
  }
  if (baseMonData.name === inputMon) {
    return [baseInputFusion];
  }

  const inputBaseFusion: PokemonDataEntry = {
    ...inputMonData,
    name: `${inputMonData.name}/${baseMonData.name}`,
    artUrl: await getArtURL(inputMonData.id, baseMonData.id),
    id: `${inputMonData.id} + ${baseMonData.id}`,
  }

  return [baseInputFusion, inputBaseFusion];
}

const filterFusions = (filters?: FusionFilters): PokemonDataEntry[] => {

  return [];
}


interface FusionTableLoadingProps {
  count: number;
}
const FusionTableLoading: React.FC<FusionTableLoadingProps> = (props) => {
  const { count } = props;

  return <>Loading fusions... ({count + 1}/420)</>;
}

interface FusionTableRenderProps {
  fusionData: PokemonDataEntry[][];
}
const FusionTableRender: React.FC<FusionTableRenderProps> = (props) => {
  const { fusionData } = props;

  const tableRows: JSX.Element[] = [];
  fusionData.forEach(pair => pair.forEach(f => {
    if (f) {
      tableRows.push(<FusionTableRow key={f.id} data={f} />);
    } else {
      console.log(pair);
    }
  }));

  return (
    <table>
      <tbody>
        <tr>
          <th>Dex No.</th>
          <th>Name</th>
          <th>Art</th>
          <th>Stats</th>
          <th>Typing</th>
          <th>Abilities</th>
          <th>Other Abilities</th>
        </tr>
        {tableRows}
      </tbody>
    </table>
  );
}

export default FusionTable;