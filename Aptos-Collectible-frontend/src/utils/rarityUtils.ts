export const rarityOptions = [
  { value: 1, label: "Common" },
  { value: 2, label: "Uncommon" },
  { value: 3, label: "Rare" },
  { value: 4, label: "Epic" },
  { value: 5, label: "Legendary" }
];

export function getRarityLabel(rarity: number): string {
  const option = rarityOptions.find(opt => opt.value === rarity);
  return option ? option.label : "Unknown";
}

