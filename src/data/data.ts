export const POKE_NAME_TO_ID = new Map<string, string>([
  ["bulbasaur", "1"],
  ["ivysaur", "2"],
  ["venusaur", "3"],
  ["charmander", "4"],
  ["charmeleon", "5"],
  ["charizard", "6"],
  ["squirtle", "7"],
  ["wartortle", "8"],
  ["blastoise", "9"],
  ["caterpie", "10"],
  ["metapod", "11"],
  ["butterfree", "12"],
  ["weedle", "13"],
  ["kakuna", "14"],
  ["beedrill", "15"],
  ["pidgey", "16"],
  ["pidgeotto", "17"],
  ["pidgeot", "18"],
  ["rattata", "19"],
  ["raticate", "20"],
  ["spearow", "21"],
  ["fearow", "22"],
  ["ekans", "23"],
  ["arbok", "24"],
  ["pikachu", "25"],
  ["raichu", "26"],
  ["sandshrew", "27"],
  ["sandslash", "28"],
  ["nidoran-f", "29"],
  ["nidorina", "30"],
  ["nidoqueen", "31"],
  ["nidoran-m", "32"],
  ["nidorino", "33"],
  ["nidoking", "34"],
  ["clefairy", "35"],
  ["clefable", "36"],
  ["vulpix", "37"],
  ["ninetales", "38"],
  ["jigglypuff", "39"],
  ["wigglytuff", "40"],
  ["zubat", "41"],
  ["golbat", "42"],
  ["oddish", "43"],
  ["gloom", "44"],
  ["vileplume", "45"],
  ["paras", "46"],
  ["parasect", "47"],
  ["venonat", "48"],
  ["venomoth", "49"],
  ["diglett", "50"],
  ["dugtrio", "51"],
  ["meowth", "52"],
  ["persian", "53"],
  ["psyduck", "54"],
  ["golduck", "55"],
  ["mankey", "56"],
  ["primeape", "57"],
  ["growlithe", "58"],
  ["arcanine", "59"],
  ["poliwag", "60"],
  ["poliwhirl", "61"],
  ["poliwrath", "62"],
  ["abra", "63"],
  ["kadabra", "64"],
  ["alakazam", "65"],
  ["machop", "66"],
  ["machoke", "67"],
  ["machamp", "68"],
  ["bellsprout", "69"],
  ["weepinbell", "70"],
  ["victreebel", "71"],
  ["tentacool", "72"],
  ["tentacruel", "73"],
  ["geodude", "74"],
  ["graveler", "75"],
  ["golem", "76"],
  ["ponyta", "77"],
  ["rapidash", "78"],
  ["slowpoke", "79"],
  ["slowbro", "80"],
  ["magnemite", "81"],
  ["magneton", "82"],
  ["farfetchd", "83"],
  ["doduo", "84"],
  ["dodrio", "85"],
  ["seel", "86"],
  ["dewgong", "87"],
  ["grimer", "88"],
  ["muk", "89"],
  ["shellder", "90"],
  ["cloyster", "91"],
  ["gastly", "92"],
  ["haunter", "93"],
  ["gengar", "94"],
  ["onix", "95"],
  ["drowzee", "96"],
  ["hypno", "97"],
  ["krabby", "98"],
  ["kingler", "99"],
  ["voltorb", "100"],
  ["electrode", "101"],
  ["exeggcute", "102"],
  ["exeggutor", "103"],
  ["cubone", "104"],
  ["marowak", "105"],
  ["hitmonlee", "106"],
  ["hitmonchan", "107"],
  ["lickitung", "108"],
  ["koffing", "109"],
  ["weezing", "110"],
  ["rhyhorn", "111"],
  ["rhydon", "112"],
  ["chansey", "113"],
  ["tangela", "114"],
  ["kangaskhan", "115"],
  ["horsea", "116"],
  ["seadra", "117"],
  ["goldeen", "118"],
  ["seaking", "119"],
  ["staryu", "120"],
  ["starmie", "121"],
  ["mr-mime", "122"],
  ["scyther", "123"],
  ["jynx", "124"],
  ["electabuzz", "125"],
  ["magmar", "126"],
  ["pinsir", "127"],
  ["tauros", "128"],
  ["magikarp", "129"],
  ["gyarados", "130"],
  ["lapras", "131"],
  ["ditto", "132"],
  ["eevee", "133"],
  ["vaporeon", "134"],
  ["jolteon", "135"],
  ["flareon", "136"],
  ["porygon", "137"],
  ["omanyte", "138"],
  ["omastar", "139"],
  ["kabuto", "140"],
  ["kabutops", "141"],
  ["aerodactyl", "142"],
  ["snorlax", "143"],
  ["articuno", "144"],
  ["zapdos", "145"],
  ["moltres", "146"],
  ["dratini", "147"],
  ["dragonair", "148"],
  ["dragonite", "149"],
  ["mewtwo", "150"],
  ["mew", "151"],
  ["chikorita", "152"],
  ["bayleef", "153"],
  ["meganium", "154"],
  ["cyndaquil", "155"],
  ["quilava", "156"],
  ["typhlosion", "157"],
  ["totodile", "158"],
  ["croconaw", "159"],
  ["feraligatr", "160"],
  ["sentret", "161"],
  ["furret", "162"],
  ["hoothoot", "163"],
  ["noctowl", "164"],
  ["ledyba", "165"],
  ["ledian", "166"],
  ["spinarak", "167"],
  ["ariados", "168"],
  ["crobat", "169"],
  ["chinchou", "170"],
  ["lanturn", "171"],
  ["pichu", "172"],
  ["cleffa", "173"],
  ["igglybuff", "174"],
  ["togepi", "175"],
  ["togetic", "176"],
  ["natu", "177"],
  ["xatu", "178"],
  ["mareep", "179"],
  ["flaaffy", "180"],
  ["ampharos", "181"],
  ["bellossom", "182"],
  ["marill", "183"],
  ["azumarill", "184"],
  ["sudowoodo", "185"],
  ["politoed", "186"],
  ["hoppip", "187"],
  ["skiploom", "188"],
  ["jumpluff", "189"],
  ["aipom", "190"],
  ["sunkern", "191"],
  ["sunflora", "192"],
  ["yanma", "193"],
  ["wooper", "194"],
  ["quagsire", "195"],
  ["espeon", "196"],
  ["umbreon", "197"],
  ["murkrow", "198"],
  ["slowking", "199"],
  ["misdreavus", "200"],
  ["unown", "201"],
  ["wobbuffet", "202"],
  ["girafarig", "203"],
  ["pineco", "204"],
  ["forretress", "205"],
  ["dunsparce", "206"],
  ["gligar", "207"],
  ["steelix", "208"],
  ["snubbull", "209"],
  ["granbull", "210"],
  ["qwilfish", "211"],
  ["scizor", "212"],
  ["shuckle", "213"],
  ["heracross", "214"],
  ["sneasel", "215"],
  ["teddiursa", "216"],
  ["ursaring", "217"],
  ["slugma", "218"],
  ["magcargo", "219"],
  ["swinub", "220"],
  ["piloswine", "221"],
  ["corsola", "222"],
  ["remoraid", "223"],
  ["octillery", "224"],
  ["delibird", "225"],
  ["mantine", "226"],
  ["skarmory", "227"],
  ["houndour", "228"],
  ["houndoom", "229"],
  ["kingdra", "230"],
  ["phanpy", "231"],
  ["donphan", "232"],
  ["porygon2", "233"],
  ["stantler", "234"],
  ["smeargle", "235"],
  ["tyrogue", "236"],
  ["hitmontop", "237"],
  ["smoochum", "238"],
  ["elekid", "239"],
  ["magby", "240"],
  ["miltank", "241"],
  ["blissey", "242"],
  ["raikou", "243"],
  ["entei", "244"],
  ["suicune", "245"],
  ["larvitar", "246"],
  ["pupitar", "247"],
  ["tyranitar", "248"],
  ["lugia", "249"],
  ["ho-oh", "250"],
  ["celebi", "251"],
  ["azurill", "252"],
  ["wynaut", "253"],
  ["ambipom", "254"],
  ["mismagius", "255"],
  ["honchkrow", "256"],
  ["bonsly", "257"],
  ["mime-jr", "258"],
  ["happiny", "259"],
  ["munchlax", "260"],
  ["mantyke", "261"],
  ["weavile", "262"],
  ["magnezone", "263"],
  ["lickilicky", "264"],
  ["rhyperior", "265"],
  ["tangrowth", "266"],
  ["electivire", "267"],
  ["magmortar", "268"],
  ["togekiss", "269"],
  ["yanmega", "270"],
  ["leafeon", "271"],
  ["glaceon", "272"],
  ["gliscor", "273"],
  ["mamoswine", "274"],
  ["porygon-z", "275"],
  ["treecko", "276"],
  ["grovyle", "277"],
  ["sceptile", "278"],
  ["torchic", "279"],
  ["combusken", "280"],
  ["blaziken", "281"],
  ["mudkip", "282"],
  ["marshtomp", "283"],
  ["swampert", "284"],
  ["ralts", "285"],
  ["kirlia", "286"],
  ["gardevoir", "287"],
  ["gallade", "288"],
  ["shedinja", "289"],
  ["kecleon", "290"],
  ["beldum", "291"],
  ["metang", "292"],
  ["metagross", "293"],
  ["bidoof", "294"],
  ["spiritomb", "295"],
  ["lucario", "296"],
  ["gible", "297"],
  ["gabite", "298"],
  ["garchomp", "299"],
  ["mawile", "300"],
  ["lileep", "301"],
  ["cradily", "302"],
  ["anorith", "303"],
  ["armaldo", "304"],
  ["cranidos", "305"],
  ["rampardos", "306"],
  ["shieldon", "307"],
  ["bastiodon", "308"],
  ["slaking", "309"],
  ["absol", "310"],
  ["duskull", "311"],
  ["dusclops", "312"],
  ["dusknoir", "313"],
  ["wailord", "314"],
  ["arceus", "315"],
  ["turtwig", "316"],
  ["grotle", "317"],
  ["torterra", "318"],
  ["chimchar", "319"],
  ["monferno", "320"],
  ["infernape", "321"],
  ["piplup", "322"],
  ["prinplup", "323"],
  ["empoleon", "324"],
  ["nosepass", "325"],
  ["probopass", "326"],
  ["honedge", "327"],
  ["doublade", "328"],
  ["aegislash-shield", "329"],
  ["pawniard", "330"],
  ["bisharp", "331"],
  ["luxray", "332"],
  ["aggron", "333"],
  ["flygon", "334"],
  ["milotic", "335"],
  ["salamence", "336"],
  ["klinklang", "337"],
  ["zoroark", "338"],
  ["sylveon", "339"],
  ["kyogre", "340"],
  ["groudon", "341"],
  ["rayquaza", "342"],
  ["dialga", "343"],
  ["palkia", "344"],
  ["giratina-altered", "345"],
  ["regigigas", "346"],
  ["darkrai", "347"],
  ["genesect", "348"],
  ["reshiram", "349"],
  ["zekrom", "350"],
  ["kyurem", "351"],
  ["roserade", "352"],
  ["drifblim", "353"],
  ["lopunny", "354"],
  ["breloom", "355"],
  ["ninjask", "356"],
  ["banette", "357"],
  ["rotom", "358"],
  ["reuniclus", "359"],
  ["whimsicott", "360"],
  ["krookodile", "361"],
  ["cofagrigus", "362"],
  ["galvantula", "363"],
  ["ferrothorn", "364"],
  ["litwick", "365"],
  ["lampent", "366"],
  ["chandelure", "367"],
  ["haxorus", "368"],
  ["golurk", "369"],
  ["pyukumuku", "370"],
  ["klefki", "371"],
  ["talonflame", "372"],
  ["mimikyu-disguised", "373"],
  ["volcarona", "374"],
  ["deino", "375"],
  ["zweilous", "376"],
  ["hydreigon", "377"],
  ["latias", "378"],
  ["latios", "379"],
  ["deoxys-normal", "380"],
  ["jirachi", "381"],
  ["nincada", "382"],
  ["bibarel", "383"],
  ["riolu", "384"],
  ["slakoth", "385"],
  ["vigoroth", "386"],
  ["wailmer", "387"],
  ["shinx", "388"],
  ["luxio", "389"],
  ["aron", "390"],
  ["lairon", "391"],
  ["trapinch", "392"],
  ["vibrava", "393"],
  ["feebas", "394"],
  ["bagon", "395"],
  ["shelgon", "396"],
  ["klink", "397"],
  ["klang", "398"],
  ["zorua", "399"],
  ["budew", "400"],
  ["roselia", "401"],
  ["drifloon", "402"],
  ["buneary", "403"],
  ["shroomish", "404"],
  ["shuppet", "405"],
  ["solosis", "406"],
  ["duosion", "407"],
  ["cottonee", "408"],
  ["sandile", "409"],
  ["krokorok", "410"],
  ["yamask", "411"],
  ["joltik", "412"],
  ["ferroseed", "413"],
  ["axew", "414"],
  ["fraxure", "415"],
  ["golett", "416"],
  ["fletchling", "417"],
  ["fletchinder", "418"],
  ["larvesta", "419"],
  ["stunfisk", "420"],
]);

export const TYPE_NAMES = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dark",
  "dragon",
  "steel",
  "fairy",
]

export interface PokemonStats {
  attack: number;
  defense: number;
  speed: number;
  "special-attack": number;
  "special-defense": number;
  hp: number;
}

export interface PokemonTypes {
  firstType: string;
  secondType: string | null;
}

export interface PokemonAbilities {
  firstAbility: string;
  secondAbility: string | null;
  hiddenAbility: string | null;
}

export interface FusionArtURL {
  url: string;
  isCustom: boolean;
}

export interface PokemonDataEntry {
  name: string;
  id: string;
  stats: PokemonStats;
  types: PokemonTypes;
  abilities: PokemonAbilities;
  artUrl?: FusionArtURL;
  fullyEvolved?: boolean;
}

export interface PokeAPIRes {
  species: {
    name: string;
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: "attack" | "defense" | "speed" | "special-attack" | "special-defense" | "hp";
    }
  }>;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
}

export interface FusionFilters {
  customArtOnly: boolean;
  typeOverride: Map<string, boolean>;
  fullyEvolvedOnly: boolean;
}

const statOverrideMap = new Map<string, PokemonStats>([
  ["aegislash", {
    attack: 50,
    defense: 150,
    speed: 60,
    "special-attack": 50,
    "special-defense": 150,
    hp: 60,
  }]
]);

const maybeGetStatOverride = (name: string): PokemonStats | null => {
  const statOverride = statOverrideMap.get(name);
  return statOverride ? statOverride : null;
}

export const parsePokeAPI = (rawRes: PokeAPIRes): PokemonDataEntry => {
  const name = rawRes.species.name as string;

  const id = POKE_NAME_TO_ID.get(name) as string;

  let stats: PokemonStats = {
    attack: 0,
    defense: 0,
    speed: 0,
    "special-attack": 0,
    "special-defense": 0,
    hp: 0
  }
  const maybeOverride = maybeGetStatOverride(name);
  if (maybeOverride) {
    stats = maybeOverride;
  } else {
    rawRes.stats.forEach(st => stats[st.stat.name] = st.base_stat);
  }

  const types: PokemonTypes = {
    firstType: rawRes.types[0].type.name as string,
    secondType: ""
  }
  if (rawRes.types.length > 1) {
    types.secondType = rawRes.types[1].type.name as string;
  }

  const abilities: PokemonAbilities = {
    firstAbility: "",
    secondAbility: null,
    hiddenAbility: null,
  }
  rawRes.abilities.forEach(a => {
    const abilityName = a.ability.name;
    if (a.is_hidden) {
      abilities.hiddenAbility = abilityName;
    } else if (a.slot !== 1) {
      abilities.secondAbility = abilityName;
    } else {
      abilities.firstAbility = abilityName;
    }
  })

  return {
    name,
    id,
    stats,
    types,
    abilities
  };
}