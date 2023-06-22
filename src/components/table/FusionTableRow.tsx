import React from "react";

import {
  PokemonDataEntry,
  POKEMON_TYPES,
  cosmetifyName,
  URI_NAME
} from "../../data/data";
import capitalize from "../shared/capitalize";



interface FusionTableRowProps {
  data: PokemonDataEntry;
}
const FusionTableRow: React.FC<FusionTableRowProps> = (props) => {
  const { data } = props;

  // Capitalize first letters, anything after a dash, anything after a space
  const cleanName = (name: string | null): JSX.Element[] => {
    if (!name) {
      return [];
    }

    const names: string[] = name.split("/");
    for (let i = 0; i < names.length; i++) {
      let n = cosmetifyName(names[i]);
      n = n.split(" ").map(w => capitalize(w)).join(" ");
      n = n.split("-").map(w => capitalize(w)).join("-");
      names[i] = n;
    }

    return names.map((n, i) => <div key={`fusion-name-${name}-${i}`}>{n}</div>);
  }

  const cleanAbility = (ability: string | null): string => {
    if (!ability) {
      return "";
    }

    return ability.split(/-+/).map(w => capitalize(w)).join(" ");
  }

  const auxAbilities = data.auxiliaryAbilities?.map((ab, i) => (
    <div key={`aux-abilities-${data.name}-${i}`}>
      {cleanAbility(ab)}
    </div>
  ));

  return (
    <tr>
      <td>
        {data.id}
      </td>

      <td>
        {cleanName(data.name)}
      </td>

      <td className="art-cell">
        {
          data.artUrl &&
          <img
            className="art-img"
            src={data.artUrl.url}
            alt={`sprite of ${data.name} fusion`}
          />
        }
        {
          data.artUrl?.isCustom &&
          <CustomSpriteIcon />
        }
      </td>

      <td className="stat-cell">
        {data.stats.attack}
      </td>
      <td className="stat-cell">
        {data.stats.defense}
      </td>
      <td className="stat-cell">
        {data.stats.speed}
      </td>

      <td className="stat-cell">
        {data.stats["special-attack"]}
      </td>
      <td className="stat-cell">
        {data.stats["special-defense"]}
      </td>
      <td className="stat-cell">
        {data.stats.hp}
      </td>

      <td className="stat-cell">
        {data.statTotal}
      </td>

      <td className="type-column">
        <div className="div-table-cell-flex">
          <div>
            <img
              className="type-icon"
              src={getTypeIcon(data.types.firstType)}
              alt={`${data.types.firstType} type icon`}
            />
          </div>
          { data.types.secondType &&
            <div className="second-type-icon">
              <img
                className="type-icon"
                src={getTypeIcon(data.types.secondType)}
                alt={`${data.types.secondType} type icon`}
              />
            </div>
          }
        </div>
      </td>

      <td>
        <div className="div-table-cell-flex">
          <div>
            {cleanAbility(data.abilities.firstAbility)}
          </div>
          { data.abilities.secondAbility &&
            <div>
              {cleanAbility(data.abilities.secondAbility)}
            </div>
          }
        </div>
      </td>

      <td>
        <div className="div-table-cell-flex">
          {auxAbilities}
        </div>
      </td>
    </tr>
  );
}

const getTypeIcon = (type: string): string => {
  if (POKEMON_TYPES.includes(type)) {
    return `${URI_NAME}/img/${type}.png`;
  }
  return `${URI_NAME}/img/unknown.png`;
}

const CustomSpriteIcon: React.FC = () => {
  return (
    <div
      className="custom-sprite-icon"
      title="Custom sprite -- check the Discord for artist credit!"
    >
      {"\uD83D\uDD8C"}
    </div>
  );
}

export default FusionTableRow;