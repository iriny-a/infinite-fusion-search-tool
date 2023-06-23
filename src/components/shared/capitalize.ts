// Capitalize first letter, anything after a dash, anything after a space
const capitalize = (s: string): string => {
  s = s.split(" ").map(w => capitalizeOne(w)).join(" ");
  s = s.split("-").map(w => capitalizeOne(w)).join("-");
  return s;
}

const capitalizeOne = (w: string): string => {
  return w.charAt(0).toUpperCase() + (w.length > 1 ? w.slice(1) : "");
}

export default capitalize;