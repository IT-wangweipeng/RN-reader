export const convertToArray = (realmObjectsArray) =>{
  let copyOfJsonArray = Array.from(realmObjectsArray);
  let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
  return jsonArray;
}

export const trim = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, "")
}

