export function territoryTypeToLabel(type) {
  const map = {
    HOUSE_TO_HOUSE: "Casa en casa",
    PHONE: "Teléfono",
  };
  return map[type] || type;
}
