import React, { useState, useEffect } from "react";

import FusionTableRow from "./FusionTableRow";
import getFusionData from "./fusionHelper";

import {
  FusionFilters,
  PokemonDataEntry,
  POKE_NAME_TO_ID,
  FusionPair,
  ArtWorkerMessage
} from "../../data/data";

import "./FusionTable.css";

const NUMBER_OF_POKEMON = POKE_NAME_TO_ID.size;


enum LoadingStatus {
  None,       // do not render any table whatsoever
  Fetching,   // art assets are being fetched from Aegide
  Processing, // sorting and filtering
  Done,       // self explanatory
}

interface FusionTableProps {
  isFormEnabled: boolean;
  setIsFormEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  currentMon: string | undefined;
  filters: FusionFilters;
  pokeData: Map<string, PokemonDataEntry>;
  fullyEvolvedList: Set<string>;
}
const FusionTable: React.FC<FusionTableProps> = (props) => {
  const { isFormEnabled, setIsFormEnabled } = props;
  const { currentMon, filters, pokeData, fullyEvolvedList } = props;

  if (!currentMon) {
    return <FusionTableNone />;
  }

  // Mostly here just for safety; it should be impossible to reach this
  // component with an invalid pokemon.
  if (POKE_NAME_TO_ID.get(currentMon) === undefined) {
    return null;
  }

  return <FusionTableHandler
    isFormEnabled={isFormEnabled}
    setIsFormEnabled={setIsFormEnabled}
    currentMon={currentMon}
    filters={filters}
    pokeData={pokeData}
    fullyEvolvedList={fullyEvolvedList}
  />
}


interface FusionTableHandlerProps {
  isFormEnabled: boolean;
  setIsFormEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  currentMon: string;
  filters: FusionFilters;
  pokeData: Map<string, PokemonDataEntry>;
  fullyEvolvedList: Set<string>;
}
const FusionTableHandler: React.FC<FusionTableHandlerProps> = (props) => {
  const { isFormEnabled, setIsFormEnabled } = props;
  const { currentMon, filters, pokeData, fullyEvolvedList } = props;
  const [ fusionData, setFusionData ] = useState<FusionPair[]>([]);
  const [ fusionDataFiltered, setFusionDataFiltered ] = useState<PokemonDataEntry[]>([]);
  const [ status, setStatus ] = useState<LoadingStatus>(LoadingStatus.None);

  // Fetch art and compute fusions
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

      // Slightly rate limit worker rollout
      (async (ms) => await new Promise(resolve => setTimeout(resolve, ms)))(50);
    }

    return (() => workerPool.forEach(w => w.terminate()));
  // We explicitly do not want status as a dependency here; this hook is ONLY
  // supposed to run when a new Pokemon is requested.
  // eslint-disable-next-line
  }, [currentMon, fullyEvolvedList, pokeData]);

  // Filter (TODO: sort)
  useEffect(() => {
    // We want to let Processing through for obvious reasons, but we also want
    // to let Done through. This is because the only time this hook will trigger
    // when the status is Done is when the filters are updated.
    if (status !== LoadingStatus.Processing && status !== LoadingStatus.Done) {
      return;
    }

    // Default sort
    let filteredPairs = fusionData.sort((p1, p2) => p1.inputId - p2.inputId);

    // NFE filter
    filteredPairs = filteredPairs.filter(dt => {
      // TODO: probably move the evolution info into the Pairs interface, it's
      // pretty hacky like this.
      return !filters.fullyEvolvedOnly || dt.headBody.fullyEvolved;
    });
    
    // Head/body filter
    let filteredData: PokemonDataEntry[] = [];
    filteredPairs.forEach(p => {
      if (filters.useInputAs === "both" || filters.useInputAs === "head") {
        filteredData.push(p.headBody);
      }
      if (p.baseMon !== p.inputMon
        && (filters.useInputAs === "both" || filters.useInputAs === "body")) {
        filteredData.push(p.bodyHead);
      }
    });

    // Custom sprite filter
    filteredData = filteredData.filter(dt => (
      !filters.customArtOnly || dt.artUrl?.isCustom
    ));

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
  }, [fusionData, filters, status]);

  // Render
  switch (status) {
    case LoadingStatus.Fetching:
      if (isFormEnabled) {
        setIsFormEnabled(false);
      }
      if (fusionData.length >= NUMBER_OF_POKEMON) {
        setStatus(LoadingStatus.Processing);
      }
      return <FusionTableLoading status={status} count={fusionData.length} />;

    case LoadingStatus.Processing:
      if (isFormEnabled) {
        setIsFormEnabled(false);
      }
      return <FusionTableLoading status={status} />;

    case LoadingStatus.Done:
      if (!isFormEnabled) {
        setIsFormEnabled(true);
      }
      return <FusionTableRender fusionData={fusionDataFiltered} />;

    case LoadingStatus.None:
    default:
      if (!isFormEnabled) {
        setIsFormEnabled(true);
      }
      return null;
  }
}


const FusionTableNone: React.FC = () => {
  return <div id="no-pokemon-msg">Enter a Pokémon of interest to load results.</div>;
}

interface FusionTableLoadingProps {
  status: LoadingStatus;
  count?: number;
}
const FusionTableLoading: React.FC<FusionTableLoadingProps> = (props) => {
  const { status, count } = props;

  if (status === LoadingStatus.Processing || (count && count + 1 === NUMBER_OF_POKEMON)) {
    return (
      <div className="loading">
        <FusionTableLoadingBall />
        Sorting and processing fusions...
        <FusionTableProgressBar count={NUMBER_OF_POKEMON} />
      </div>
      
    );
  }

  if (status === LoadingStatus.Fetching) {
    return (
      <div className="loading">
        <FusionTableLoadingBall />
        Loading fusions... ({count ? count + 1 : 0}/{NUMBER_OF_POKEMON})
        <FusionTableProgressBar count={count ? count + 1 : 0 } />
      </div>
    );
  }
  
  return null;
}


const FusionTableLoadingBall: React.FC = () => {
  return (
    <div id="loading-ball">
      <img src="./icons/pokeball_shake.gif" alt="loading spinner" />
    </div>
  );
}


interface FusionTableProgressBarProps {
  count: number;
}
const FusionTableProgressBar: React.FC<FusionTableProgressBarProps> = (props) => {
  const { count } = props;

  return (
    <div id="progress-bar">
      <div id="progress-bar-completed" style={{width: `${count / NUMBER_OF_POKEMON * 100}%`}}></div>
    </div>
  )
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
    }
  });

  return (
    <div id="fusion-table-container">
      <h2>Search Results ({fusionData.length} found)</h2>
      <table id="fusion-table">
        <thead id="fusion-table-head">
          <tr>
            <th>Dex No.</th>
            <th>Name</th>
            <th>Art</th>
            <th>Atk</th>
            <th>Def</th>
            <th>Spe</th>
            <th>SpA</th>
            <th>SpD</th>
            <th>HP</th>
            <th>Typing</th>
            <th>Abilities</th>
            <th>Other Abilities</th>
          </tr>
        </thead>

        <tbody>
          {tableRows}
        </tbody>
      </table>
    </div>
  );
}

export default FusionTable;