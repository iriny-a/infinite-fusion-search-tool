const AEGIDE_CUSTOM_URL = "https://raw.githubusercontent.com/Aegide/custom-fusion-sprites/main/CustomBattlers/";
const AEGIDE_AUTOGEN_URL = "https://raw.githubusercontent.com/Aegide/autogen-fusion-sprites/master/Battlers/";


onmessage = async function(e) {
  const { baseId, inputId } = e.data;
 
  this.postMessage({
    headBodyArt: await getArtURL(baseId, inputId),
    bodyHeadArt: await getArtURL(inputId, baseId),
  });
}

const getArtURL = async (headId, bodyId) => {
  const aegideURL = AEGIDE_CUSTOM_URL + `${headId}.${bodyId}.png`;
  const maybeAegideRes = await fetch(aegideURL);
  if (maybeAegideRes.status === 200) {
    return {
      url: aegideURL,
      isCustom: true,
    };
  }
  return {
    url: AEGIDE_AUTOGEN_URL + `${headId}/${headId}.${bodyId}.png`,
    isCustom: false,
  };
}