import React, { useState, useEffect } from "react";

import FusionTableRow from "./FusionTableRow";
import getFusionData from "./fusionHelper";

import {
  FusionFilters,
  PokemonDataEntry,
  POKE_NAME_TO_ID,
  FusionPair,
  ArtWorkerMessage,
  FusionSortBy,
  URI_NAME
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
      const worker = new Worker(`${URI_NAME}/artWorker.js`);
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

  // Filter
  useEffect(() => {
    // We want to let Processing through for obvious reasons, but we also want
    // to let Done through. This is because the only time this hook will trigger
    // when the status is Done is when the filters are updated.
    if (status !== LoadingStatus.Processing && status !== LoadingStatus.Done) {
      return;
    }

    let filteredPairs = [...fusionData];

    // NFE filter
    filteredPairs = filteredPairs.filter(dt => {
      // TODO: probably move the evolution info into the Pairs interface, it's
      // pretty hacky like this.
      return !filters.fullyEvolvedOnly || dt.headBody.fullyEvolved;
    });
    
    // Head/body filter
    let filteredData: PokemonDataEntry[] = [];
    filteredPairs.forEach(p => {
      switch (filters.useInputAs) {
        case "both":
          filteredData.push(p.headBody);
          if (p.baseMon !== p.inputMon) {
            filteredData.push(p.bodyHead);
          }
          break;

        case "head":
          filteredData.push(p.headBody);
          break;

        case "body":
          filteredData.push(p.bodyHead);
          break;
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

  // Form control
  useEffect(() => {
    switch(status) {
      case LoadingStatus.Fetching:
      case LoadingStatus.Processing:
        if (isFormEnabled) {
          setIsFormEnabled(false);
        }
        break;
      
      case LoadingStatus.None:
      case LoadingStatus.Done:
      default:
        if (!isFormEnabled) {
          setIsFormEnabled(true);
        }
        break;
    }
  // isFormEnabled and setIsFormEnabled are not necessary dependencies here
  // eslint-disable-next-line
  }, [status])

  // Render
  switch (status) {
    case LoadingStatus.Fetching:
      if (fusionData.length >= NUMBER_OF_POKEMON) {
        setStatus(LoadingStatus.Processing);
      }
      return <FusionTableLoading status={status} count={fusionData.length} />;

    case LoadingStatus.Processing:
      return <FusionTableLoading status={status} />;

    case LoadingStatus.Done:
      return <FusionTableSorting fusionData={fusionDataFiltered} />;

    case LoadingStatus.None:
    default:
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
      <img src={`${URI_NAME}/img/pokeball_shake.gif`} alt="loading spinner" />
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


const getDefaultSort = (): FusionSortBy => {
  return {
    field: "id",
    direction: "ascending",
  }
}

interface FusionTableSortingProps {
  fusionData: PokemonDataEntry[];
}
const FusionTableSorting: React.FC<FusionTableSortingProps> = (props) => {
  const { fusionData } = props;
  const [ fusionDataSorted, setFusionDataSorted ] = useState<PokemonDataEntry[]>([]);
  const [ sortBy, setSortBy ] = useState<FusionSortBy>(getDefaultSort());

  useEffect(() => {
    const sortFn = (d1: PokemonDataEntry, d2: PokemonDataEntry): number => {
      const dMult = sortBy.direction === "ascending" ? 1 : -1;
      let rval = 0;

      switch (sortBy.field) {
        case "id":
          rval = parseInt(d1.incomingId as string) - parseInt(d2.incomingId as string);
          break;
        case "name":
          if (d1.incomingName === undefined || d2.incomingName === undefined) {
            rval = 0;
            break;
          }
          
          rval = d1.incomingName?.localeCompare(d2.incomingName as string);
          break;
        case "atk":
          rval = d1.stats.attack - d2.stats.attack;
          break;
        case "def":
          rval = d1.stats.defense - d2.stats.defense;
          break;
        case "spe":
          rval = d1.stats.speed - d2.stats.speed;
          break;
        case "spa":
          rval = d1.stats["special-attack"] - d2.stats["special-attack"];
          break;
        case "spd":
          rval = d1.stats["special-defense"] - d2.stats["special-defense"];
          break;
        case "hp":
          rval = d1.stats.hp - d2.stats.hp;
          break;
        case "total":
          rval = (d1.statTotal as number) - (d2.statTotal as number);
          break;
      }

      return dMult * rval;
    }

    // Spreading here is necessary for React to consider it a different array
    setFusionDataSorted([...fusionData.sort(sortFn)]);
  }, [fusionData, sortBy]);

  const handleChangeSort = (incField: FusionSortBy["field"]) => {
    // If the incoming field is different from the current one, switch to the
    // incoming and default to ascending
    if (sortBy.field !== incField) {
      setSortBy({
        field: incField,
        direction: "ascending",
      });
      return;
    }

    // Otherwise, swap the direction
    setSortBy(sb => ({
      ...sb,
      direction: sb.direction === "ascending" ? "descending" : "ascending",
    }));
  }

  return (
    <FusionTableRender
      fusionData={fusionDataSorted}
      sortBy={sortBy}
      handleChangeSort={handleChangeSort}
    />
  );
}


interface FusionTableRenderProps {
  fusionData: PokemonDataEntry[];
  sortBy: FusionSortBy;
  handleChangeSort: (incField: FusionSortBy["field"]) => void;
}
const FusionTableRender: React.FC<FusionTableRenderProps> = (props) => {
  const { fusionData, sortBy, handleChangeSort } = props;
  const [ tableRows, setTableRows ] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const rows: JSX.Element[] = [];
    fusionData.forEach((f, i) => {
      if (f) {
        rows.push(
          <FusionTableRow
            key={f.id}
            data={f}
          />
        );
      }
    });
    setTableRows(rows);
  }, [fusionData]);

  if (!fusionData.length) {
    return null;
  }

  return (
    <div id="fusion-table-container">
      <h1>Search Results ({fusionData.length} found)</h1>
      <div id="fusion-table-wrapper">
        <table id="fusion-table">
          <thead id="fusion-table-head">
            <tr>
              <th>
                <div className="header-with-sort">
                  <span>No.</span>
                  <ChangeSort
                    handleChangeSort={handleChangeSort}
                    fieldName="id"
                    activeSort={sortBy}
                    />
                </div>
              </th>
              <th>
                <div className="header-with-sort">
                  <span>Name</span>
                  <ChangeSort
                    handleChangeSort={handleChangeSort}
                    fieldName="name"
                    activeSort={sortBy}
                    />
                </div>
              </th>
              <th>
                <span>Fusion Sprite</span>
              </th>
              <th className="stat-heading">
                <div className="header-with-sort">
                  <span>Atk</span>
                  <ChangeSort
                    handleChangeSort={handleChangeSort}
                    fieldName="atk"
                    activeSort={sortBy}
                  />
                </div>
              </th>
              <th className="stat-heading">
                <div className="header-with-sort">
                  <span>Def</span>
                  <ChangeSort
                    handleChangeSort={handleChangeSort}
                    fieldName="def"
                    activeSort={sortBy}
                  />
                </div>
              </th>
              <th className="stat-heading">
                <div className="header-with-sort">
                  <span>Spe</span>
                  <ChangeSort
                    handleChangeSort={handleChangeSort}
                    fieldName="spe"
                    activeSort={sortBy}
                  />
                </div>
              </th>
              <th className="stat-heading">
                <div className="header-with-sort">
                  <span>SpA</span>
                  <ChangeSort
                    handleChangeSort={handleChangeSort}
                    fieldName="spa"
                    activeSort={sortBy}
                  />
                </div>
              </th>
              <th className="stat-heading">
                <div className="header-with-sort">
                  <span>SpD</span>
                  <ChangeSort
                    handleChangeSort={handleChangeSort}
                    fieldName="spd"
                    activeSort={sortBy}
                  />
                </div>
              </th>
              <th className="stat-heading">
                <div className="header-with-sort">
                  <span>HP</span>
                  <ChangeSort
                    handleChangeSort={handleChangeSort}
                    fieldName="hp"
                    activeSort={sortBy}
                  />
                </div>
              </th>
              <th className="stat-heading">
                <div className="header-with-sort">
                  <span>BST</span>
                  <ChangeSort
                    handleChangeSort={handleChangeSort}
                    fieldName="total"
                    activeSort={sortBy}
                  />
                </div>
              </th>
              <th>
                <span>Types</span>
              </th>
              <th>
                <span>Default Abilities</span>
              </th>
              <th>
                <span>Other Abilities</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    </div>
  );
}


interface ChangeSortProps {
  handleChangeSort: (incField: FusionSortBy["field"]) => void;
  fieldName: FusionSortBy["field"];
  activeSort: FusionSortBy;
}
const ChangeSort: React.FC<ChangeSortProps> = (props) => {
  const { handleChangeSort, fieldName, activeSort } = props;

  const getIcon = (): string => {
    if (fieldName !== activeSort.field) {
      return "\u2B83"; // up-down arrow
    }

    if (activeSort.direction === "ascending") {
      return "\u2BC5"; // up-pointing triangle
    }

    return "\u2BC6"; // down-pointing triangle
  }

  return (
    <span
      className="sort-icon"
      onClick={() => handleChangeSort(fieldName)}
    >
      {getIcon()}
    </span>
  );
}




export default FusionTable;