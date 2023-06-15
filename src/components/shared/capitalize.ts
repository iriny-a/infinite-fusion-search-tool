const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + (s.length > 1 ? s.slice(1) : "");
}

export default capitalize;