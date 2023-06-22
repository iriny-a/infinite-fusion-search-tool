import { PokemonAbilities, PokemonDataEntry, PokemonTypes, getStatTotal, maybeGetTypingOverride } from "../../data/data";
import capitalize from "../shared/capitalize";

const getFusionData = (
  headData: PokemonDataEntry,
  bodyData: PokemonDataEntry,
  incomingMon: "head" | "body",
  fullyEvolvedList: Set<string>
): PokemonDataEntry => {
  const [abilities, auxAbilities] = getFusionAbilities(headData, bodyData);
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
    abilities: abilities,
    auxiliaryAbilities: auxAbilities,

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
  headData: PokemonDataEntry,
  bodyData: PokemonDataEntry,
): [PokemonAbilities, string[]] => {
  const headAbilities = headData.abilities;
  const bodyAbilities = bodyData.abilities;

  // Most fusions default to the head's second ability and the body's first.
  // If the head doesn't have a second ability, use its first.
  const fusionAbilities: PokemonAbilities = {
    firstAbility: bodyAbilities.firstAbility,
    secondAbility: headAbilities.secondAbility || headAbilities.firstAbility,
    hiddenAbility: null,
  }
  // Remove duplicates
  if (fusionAbilities.firstAbility === fusionAbilities.secondAbility) {
    fusionAbilities.secondAbility = null;
  }

  // Lazily enumerate the abilities that weren't selected above and throw in the
  // HAs as well (TODO: make this better lol)
  const auxAbilities = new Set<string | null>([
    headAbilities.firstAbility,
    headAbilities.secondAbility,
    bodyAbilities.firstAbility,
    bodyAbilities.secondAbility,
    headAbilities.hiddenAbility ? headAbilities.hiddenAbility + " (HA)" : null,
    bodyAbilities.hiddenAbility ? bodyAbilities.hiddenAbility + " (HA)" : null,
  ]);
  auxAbilities.delete(null);
  auxAbilities.delete(fusionAbilities.firstAbility);
  auxAbilities.delete(fusionAbilities.secondAbility);

 return [fusionAbilities, Array.from(auxAbilities) as Array<string>];
}

const weightStat = (higher: number, lower: number): number => {
  return Math.floor((higher * 2 + lower) / 3);
}

export default getFusionData;