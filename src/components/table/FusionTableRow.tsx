import React from "react";

import { PokemonDataEntry, POKEMON_TYPES } from "../../data/data";
import capitalize from "../shared/capitalize";



interface FusionTableRowProps {
  data: PokemonDataEntry;
}
const FusionTableRow: React.FC<FusionTableRowProps> = (props) => {
  const { data } = props;

  const cleanName = (name: string | null): string => {
    if (!name) {
      return "";
    }

    return name.split("/").map(n => capitalize(n)).join("/");
  }
  const cleanAbility = (ability: string | null): string => {
    if (!ability) {
      return "";
    }

    return ability.split(/-+/).map(w => capitalize(w)).join(" ");
  }

  return (
    <tr>
      <td>
        {data.id}
      </td>

      <td>
        {cleanName(data.name)}
      </td>

      <td style={{
        height: "200px",
        width: "200px",
        border: data.artUrl?.isCustom ? "solid green 3px" : "inherit"}}
      >
        {
          data.artUrl &&
          <img
            src={data.artUrl.url}
            style={{width: "100%"}}
            alt={`sprite of ${data.name} fusion`}
          />
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
            <tr>
              <td>
                {
                  data.types.secondType &&
                  <img
                    className="type-icon"
                    src={getTypeIcon(data.types.secondType)}
                    alt={`${data.types.secondType} type icon`}
                  />
                }
              </td>
            </tr>
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
            <tr>
              <td>
                Ability3
              </td>
            </tr>
            <tr>
              <td>
                Ability4
              </td>
            </tr>
            <tr>
              <td>
                HA1
              </td>
            </tr>
            <tr>
              <td>
                HA2
              </td>
            </tr>
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

export default FusionTableRow;