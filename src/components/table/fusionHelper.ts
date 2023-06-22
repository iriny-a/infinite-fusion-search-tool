import { PokemonAbilities, PokemonDataEntry, PokemonTypes, getStatTotal, maybeGetTypingOverride } from "../../data/data";
import capitalize from "../shared/capitalize";

const getFusionData = (
  headData: PokemonDataEntry,
  bodyData: PokemonDataEntry,
  incomingMon: "head" | "body",
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
    types: getFusionTyping(headData, bodyData),
    abilities: getFusionAbilities(headData.abilities, bodyData.abilities),

    incomingId: incomingMon === "head" ? headData.id : bodyData.id,
    incomingName: incomingMon === "head" ? headData.name : bodyData.name,
    // We want fully evolved status to be a useful table-wide filter, so we need
    // to know which mon to consider the fully evolved status of. This is a bit
    // counterintuitive since it's not how the game considers mons to be fully
    // evolved, but if we don't do this, it's impossible to filter on this
    // criteria if the input mon isn't fully evolved.
    fullyEvolved: incomingMon === "head" ? fullyEvolvedList.has(headData.name) : fullyEvolvedList.has(bodyData.name),
  }
  fusionData.statTotal = getStatTotal(fusionData.stats);

  return fusionData;
}

const getFusionTyping = (
  headData: PokemonDataEntry,
  bodyData: PokemonDataEntry
): PokemonTypes => {
  // Heads will usually contribute their first type, unless overridden.
  let headContribution = headData.types.firstType;
  const headTypeOverride = maybeGetTypingOverride(headData);
  if (headTypeOverride) {
    headContribution = headTypeOverride;
  }

  // Bodies usually contribute their second type if they have one.
  let bodyContribution = bodyData.types.secondType;
  // This can be overridden as well.
  const bodyTypeOverride = maybeGetTypingOverride(bodyData);
  if (bodyTypeOverride) {
    bodyContribution = bodyTypeOverride;
  // Otherwise, use the first type if the second type doesn't apply.
  } else if (!bodyContribution || bodyContribution === headContribution) {
    bodyContribution = bodyData.types.firstType;
  }

  // Final cleanup
  if (headContribution === bodyContribution) {
    bodyContribution = null;
  }

  const fusionTyping: PokemonTypes = {
    firstType: headContribution,
    secondType: bodyContribution,
  }
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

const weightStat = (higher: number, lower: number): number => {
  return Math.floor((higher * 2 + lower) / 3);
}

export default getFusionData;