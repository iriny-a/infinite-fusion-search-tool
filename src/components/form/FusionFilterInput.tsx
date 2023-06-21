import React from "react";

import { FusionFilters, POKEMON_TYPES } from "../../data/data";

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

  const handleUseInputAsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.currentTarget.id;
    let newUseAs = id.slice(id.length - 4) as "head" | "body" | "both";
    if (newUseAs !== "head" && newUseAs !== "body") {
      newUseAs = "both";
    }

    setFilters({
      ...filters,
      useInputAs: newUseAs,
    })
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
    <div>
      <h3 className="center">Search Filters</h3>
      <form>
        <div id="all-filters-container">
          <div id="toggleable-filters-container">
            <div>
              <input
                type="checkbox"
                id="checkbox-custom-sprites"
                onChange={handleCustomArtCheck}
                checked={filters.customArtOnly}
                />
              <label htmlFor="checkbox-custom-sprites">Custom sprites only</label>
            </div>

            <div>
              <input
                type="checkbox"
                id="checkbox-fully-evolved"
                onChange={handleFullyEvolvedCheck}
                checked={filters.fullyEvolvedOnly}
                />
              <label htmlFor="checkbox-fully-evolved">Fully evolved only</label>
            </div>

            <fieldset id="radio-fieldset">
              <div>
                <input
                  type="radio"
                  id="input-as-head"
                  name="use-input-as"
                  onChange={handleUseInputAsChange}
                  defaultChecked={filters.useInputAs === "head"}
                />
                <label
                  htmlFor="input-as-head"
                >
                  Input is head
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  id="input-as-body"
                  name="use-input-as"
                  onChange={handleUseInputAsChange}
                  defaultChecked={filters.useInputAs === "body"}
                />
                <label
                  htmlFor="input-as-body"
                >
                  Input is body
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  id="input-as-both"
                  name="use-input-as"
                  onChange={handleUseInputAsChange}
                  defaultChecked={filters.useInputAs === "both"}
                />
                <label
                  htmlFor="input-as-both"
                >
                  Input is head or body
                </label>
              </div>
            </fieldset>
          </div>

          <div id="type-filter-container">
            <div id="type-filter-checkboxes">
              {
                POKEMON_TYPES.map(t => (
                  <div
                    key={`type-${t}`}
                    className={`checkbox-type-container ${filters.typeOverride.get(t) ? "" : "faded"}`}
                  >
                    <input type="checkbox"
                      id={`checkbox-type-${t}`}
                      onChange={e => handleTypeFilterChange(e, t)}
                      checked={filters.typeOverride.get(t)}
                      />
                    <label htmlFor={`checkbox-type-${t}`} >
                      <img
                        src={`./icons/${t}.png`}
                        className="checkbox-type-img"
                        alt={`${t} type icon`}
                      />
                    </label>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FusionFilterInput;