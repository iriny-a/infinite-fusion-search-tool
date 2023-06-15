import React from "react";

import { PokemonDataEntry } from "../../data/data";
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
        {data.artUrl ? <img src={data.artUrl.url} style={{width: "100%"}} /> : null}
      </td>

      <td>
        <table>
          <tbody>
            <tr>
              <td>
                {data.stats.attack}
              </td>
            </tr>
            <tr>
              <td>
                {data.stats.defense}
              </td>
            </tr>
            <tr>
              <td>
                {data.stats.speed}
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <td>
                {data.stats["special-attack"]}
              </td>
            </tr>
            <tr>
              <td>
                {data.stats["special-defense"]}
              </td>
            </tr>
            <tr>
              <td>
                {data.stats.hp}
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
                {capitalize(data.types.firstType)}
              </td>
            </tr>
            <tr>
              <td>
                {data.types.secondType ? capitalize(data.types.secondType) : ""}
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

export default FusionTableRow;