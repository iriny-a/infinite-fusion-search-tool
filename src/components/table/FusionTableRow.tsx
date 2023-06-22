import React from "react";

import { PokemonDataEntry, POKEMON_TYPES, cosmetifyName, FusionSortBy } from "../../data/data";
import capitalize from "../shared/capitalize";



interface FusionTableRowProps {
  data: PokemonDataEntry;
}
const FusionTableRow: React.FC<FusionTableRowProps> = (props) => {
  const { data } = props;

  // Capitalize first letters, anything after a dash, anything after a space
  const cleanName = (name: string | null): string => {
    if (!name) {
      return "";
    }

    const names: string[] = name.split("/");
    for (let i = 0; i < names.length; i++) {
      let n = cosmetifyName(names[i]);
      n = n.split(" ").map(w => capitalize(w)).join(" ");
      n = n.split("-").map(w => capitalize(w)).join("-");
      names[i] = n;
    }

    return names.join("/");
  }
  const cleanAbility = (ability: string | null): string => {
    if (!ability) {
      return "";
    }

    return ability.split(/-+/).map(w => capitalize(w)).join(" ");
  }

  const auxAbilities: JSX.Element[] = [];
  for (let i = 0; i < 4; i++) {
    auxAbilities.push((
      <tr key={`aux-abilities-${data.name}-${i}`}>
        <td>
          {data.auxiliaryAbilities && cleanAbility(data.auxiliaryAbilities[i])}
        </td>
      </tr>
    ));
  }

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

      <td>
        {data.stats.attack}
      </td>
      <td>
        {data.stats.defense}
      </td>
      <td>
        {data.stats.speed}
      </td>

      <td>
        {data.stats["special-attack"]}
      </td>
      <td>
        {data.stats["special-defense"]}
      </td>
      <td>
        {data.stats.hp}
      </td>

      <td>
        {data.statTotal}
      </td>

      <td className="type-column">
        <table>
          <tbody>
            <tr>
              <td>
                <img
                  className="type-icon"
                  src={getTypeIcon(data.types.firstType)}
                  alt={`${data.types.firstType} type icon`}
                />
              </td>
            </tr>
            { data.types.secondType &&
              <tr>
                <td>
                    <img
                      className="type-icon"
                      src={getTypeIcon(data.types.secondType)}
                      alt={`${data.types.secondType} type icon`}
                    />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </td>

      <td>
        <table>
          <tbody>
            <tr>
              <td>
                {cleanAbility(data.abilities.firstAbility)}
              </td>
            </tr>
            <tr>
              <td>
                {cleanAbility(data.abilities.secondAbility)}
              </td>
            </tr>
          </tbody>
        </table>
      </td>

      <td>
        <table>
          <tbody>
            {auxAbilities}
          </tbody>
        </table>
      </td>
    </tr>
  );
}

const getTypeIcon = (type: string): string => {
  if (POKEMON_TYPES.includes(type)) {
    return `./icons/${type}.png`;
  }
  return `./icons/unknown.png`;
}

const CustomSpriteIcon: React.FC = () => {
  return (
    <div
      className="custom-sprite-icon"
      title="Custom sprite"
    >
      {"\uD83D\uDD8C"}
    </div>
  );
}

export default FusionTableRow;