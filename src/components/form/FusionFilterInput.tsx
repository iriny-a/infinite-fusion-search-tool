import React, { ChangeEvent } from "react";

import { FusionFilters, TYPE_NAMES } from "../../data/data";
import capitalize from "../shared/capitalize";

interface FusionFilterInputProps {
  filters: FusionFilters;
  setFilters: React.Dispatch<React.SetStateAction<FusionFilters>>;
}
const FusionFilterInput: React.FC<FusionFilterInputProps> = (props) => {
  const { filters, setFilters } = props;

  const handleCustomArtCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      customArtOnly: !filters.customArtOnly,
    });
  }

  const handleFullyEvolvedCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      fullyEvolvedOnly: !filters.fullyEvolvedOnly,
    });
  }

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLInputElement>, t: string) => {
    let typeMap = filters.typeOverride;
    if (!typeMap.get(t)) {
      typeMap.set(t, true);
    } else {
      typeMap.set(t, false);
    }
    setFilters({
      ...filters,
      typeOverride: typeMap,
    });
  }

  return (
    <form>
      <div>
        <input type="checkbox"
          name="customArt"
          onChange={handleCustomArtCheck} 
        />
        <label htmlFor="customArt">Only include custom sprites</label>
      </div>

      <div>
        <input type="checkbox"
          name="fullyEvolved"
          onChange={handleFullyEvolvedCheck} 
        />
        <label htmlFor="customArt">Only include fully evolved</label>
      </div>

      <label>Include only selected types:</label>
      <div id="type-filter-container">
        {
          TYPE_NAMES.map(t => (
            <div key={`type-${t}`}>
              <input type="checkbox"
                name={t}
                onChange={e => handleTypeFilterChange(e, t)}
                />
              <label htmlFor={t}>{capitalize(t)}</label>
            </div>
          ))
        }
      </div>
    </form>

    
  );
}

export default FusionFilterInput;