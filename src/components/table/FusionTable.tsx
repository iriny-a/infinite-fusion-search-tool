import React, { useState, useEffect } from "react";

import FusionTableRow from "./FusionTableRow";

import {
  FusionFilters,
  PokemonDataEntry,
  POKE_NAME_TO_ID,
  PokemonTypes,
  PokemonAbilities,
  FusionPair,
  ArtWorkerMessage
} from "../../data/data";

import "./FusionTable.css";
import capitalize from "../shared/capitalize";

const NUMBER_OF_POKEMON = POKE_NAME_TO_ID.size;


enum LoadingStatus {
  None,       // do not render any table whatsoever
  Fetching,   // art assets are being fetched from Aegide
  Processing, // sorting and filtering
  Done,       // self explanatory
}

interface FusionTableProps {
  currentMon: string | undefined;
  filters: FusionFilters;
  pokeData: Map<string, PokemonDataEntry>;
  fullyEvolvedList: Set<string>;
}
const FusionTable: React.FC<FusionTableProps> = (props) => {
  const { currentMon, filters, pokeData, fullyEvolvedList } = props;

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
    pokeData={pokeData}
    fullyEvolvedList={fullyEvolvedList}
  />
}


interface FusionTableHandlerProps {
  currentMon: string;
  filters: FusionFilters;
  pokeData: Map<string, PokemonDataEntry>;
  fullyEvolvedList: Set<string>;
}
const FusionTableHandler: React.FC<FusionTableHandlerProps> = (props) => {
  const { currentMon, filters, pokeData, fullyEvolvedList } = props;
  const [ fusionData, setFusionData ] = useState<FusionPair[]>([]);
  const [ fusionDataFiltered, setFusionDataFiltered ] = useState<PokemonDataEntry[]>([]);
  const [ status, setStatus ] = useState<LoadingStatus>(LoadingStatus.None);

  // Fetching art and computing fusions
  useEffect(() => {
    const currentMonData = pokeData.get(currentMon);
    if (!currentMonData) {
      return;
    }

    if (status !== LoadingStatus.Fetching) {
      setStatus(LoadingStatus.Fetching);
    }
    setFusionData([]);

    const workerPool: Array<Worker> = [];
    for (const [name, data] of pokeData) {
      const worker = new Worker("artWorker.js");
      workerPool.push(worker);
      worker.postMessage({baseId: currentMonData.id, inputId: data.id});
      worker.onmessage = (e: MessageEvent) => {
        const artRes = e.data as ArtWorkerMessage;
        const pair = {
          baseMon: currentMon,
          inputMon: name,
          inputId: parseInt(data.id),
          headBody: getFusionData(currentMonData, data, "body", fullyEvolvedList),
          bodyHead: getFusionData(data, currentMonData, "head", fullyEvolvedList),
        }
        pair.headBody.artUrl = artRes.headBodyArt;
        pair.bodyHead.artUrl = artRes.bodyHeadArt;

        setFusionData(prev => [...prev, pair]);
        worker.terminate();
      }

      // Rate limit worker rollout
      (async (ms) => await new Promise(resolve => setTimeout(resolve, ms)))(50);
    }

    return (() => workerPool.forEach(w => w.terminate()));
  }, [currentMon, fullyEvolvedList, pokeData]);

  // Filtering (TODO: sorting)
  useEffect(() => {
    // We want to let Processing through for obvious reasons, but we also want
    // to let Done through. This is because the only time this hook will trigger
    // when the status is Done is when the filters are updated.
    if (status !== LoadingStatus.Processing && status !== LoadingStatus.Done) {
      return;
    }

    // NFE filter
    const filteredPairs = fusionData.filter(dt => {
      // TODO: probably move the evolution info into the Pairs interface, it's
      // pretty hacky like this.
      return !filters.fullyEvolvedOnly || dt.headBody.fullyEvolved;
    });
    
    // Custom art filter
    let filteredData: PokemonDataEntry[] = [];
    filteredPairs.forEach(p => {
      if (!filters.customArtOnly || p.headBody.artUrl?.isCustom) {
        filteredData.push(p.headBody);
      }
      if (p.baseMon !== p.inputMon && (!filters.customArtOnly || p.bodyHead.artUrl?.isCustom)) {
        filteredData.push(p.bodyHead);
      }
    });

    // Typing filter
    const typingFilterOverride = (
      // typing filter is empty
      !filters.typeOverride.size
      // typing filter used to have items but they were all deselected
      || Array.from(filters.typeOverride.values()).every(f => f === false)
    );
    filteredData = filteredData.filter(dt => {
      if (typingFilterOverride) {
        return true;
      }

      return (filters.typeOverride.get(dt.types.firstType)
      || filters.typeOverride.get(dt.types.secondType as string));
    });

    setFusionDataFiltered(filteredData);
    setStatus(LoadingStatus.Done);
  }, [fusionData, filters]);

  switch (status) {
    case LoadingStatus.Fetching:
      if (fusionData.length >= NUMBER_OF_POKEMON) {
        setStatus(LoadingStatus.Processing);
      }
      return <FusionTableLoading status={status} count={fusionData.length} />;

    case LoadingStatus.Processing:
      return <FusionTableLoading status={status} />;

      case LoadingStatus.Done:
        return <FusionTableRender fusionData={fusionDataFiltered} />;

      case LoadingStatus.None:
      default:
        return null;
  }
}


const weightStat = (higher: number, lower: number): number => {
  return Math.floor((higher * 2 + lower) / 3);
}

const getFusionTyping = (
  headTypes: PokemonTypes,
  bodyTypes: PokemonTypes
  ): PokemonTypes => {
  // Most fusions will take head's primary type and body's secondary type
  const fusionTyping: PokemonTypes = {
    firstType: headTypes.firstType,
    secondType: bodyTypes.secondType
  }
  // TODO: overrides, exceptions, and edge cases

  return fusionTyping;
}

const getFusionAbilities = (
   headAbilities: PokemonAbilities,
   bodyAbilities: PokemonAbilities
   ): PokemonAbilities => {
  // Most fusions will take head's second ability or body's first ability
  const fusionAbilities: PokemonAbilities = {
    firstAbility: bodyAbilities.firstAbility,
    secondAbility: headAbilities.secondAbility,
    hiddenAbility: null,
  }
  // TODO: overrides, exceptions, edge cases, and HA

  return fusionAbilities;
}

const getFusionData = (
  headData: PokemonDataEntry,
  bodyData: PokemonDataEntry,
  inputMon: "head" | "body",
  fullyEvolvedList: Set<string>
  ): PokemonDataEntry => {
  const fusionData: PokemonDataEntry = {
    name: `${capitalize(headData.name)}/${capitalize(bodyData.name)}`,
    id: `${headData.id}.${bodyData.id}`,
    stats: {
      // weighted by body
      attack: weightStat(bodyData.stats.attack, headData.stats.attack),
      defense: weightStat(bodyData.stats.defense, headData.stats.defense),
      speed: weightStat(bodyData.stats.speed, headData.stats.speed),

      // weighted by head
      "special-attack": weightStat(headData.stats["special-attack"], bodyData.stats["special-attack"]),
      "special-defense": weightStat(headData.stats["special-defense"], bodyData.stats["special-defense"]),
      hp: weightStat(headData.stats.hp, bodyData.stats.hp),
    },
    types: getFusionTyping(headData.types, bodyData.types),
    abilities: getFusionAbilities(headData.abilities, bodyData.abilities),
    // We want fully evolved status to be a useful table-wide filter, so we need
    // to know which mon to consider the fully evolved status of. This is a bit
    // counterintuitive since it's not how the game considers mons to be fully
    // evolved, but if we don't do this, it's impossible to filter on this
    // criteria if the input mon isn't fully evolved.
    fullyEvolved: inputMon === "head" ? fullyEvolvedList.has(headData.name) : fullyEvolvedList.has(bodyData.name),
  }

  return fusionData;
}


interface FusionTableLoadingProps {
  status: LoadingStatus;
  count?: number;
}
const FusionTableLoading: React.FC<FusionTableLoadingProps> = (props) => {
  const { status, count } = props;

  if (status === LoadingStatus.Processing || (count && count + 1 === NUMBER_OF_POKEMON)) {
    return <>Sorting and processing fusions...</>;
  }

  if (status === LoadingStatus.Fetching && count) {
    return <>Loading fusions... ({count + 1}/{NUMBER_OF_POKEMON})</>;
  }
  
  return null;
}


interface FusionTableRenderProps {
  fusionData: PokemonDataEntry[];
}
const FusionTableRender: React.FC<FusionTableRenderProps> = (props) => {
  const { fusionData } = props;

  const tableRows: JSX.Element[] = [];
  fusionData.forEach(f => {
    if (f) {
      tableRows.push(<FusionTableRow key={f.id} data={f} />);
    } else {
      console.log(f);
    }
  });

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