export function scanForAllergen(
  userAllergens: string[],
  ingredients: string
): string[] {
  if (!userAllergens.length || !ingredients) return []; // early return if no allergens or ingredients

  // normalize ingredients string
  // lowercase
  // replace hyphens with spaces
  // replace punctuation and extra whitespace with single spaces
  const normalizedIngredients = ingredients
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[\s,():.]+/g, " ");

  // create Set for (O)1 lookup performance
  const ingredientsSet = new Set(
    normalizedIngredients.split(" ").filter(Boolean)
  );

  const allergensDetected: string[] = [];

  // check each allergen against the normalized ingredients
  for (const allergen of userAllergens) {
    // normalize allergen
    // lowercase and replace hyphens with spaces
    const allergenNormalized = allergen.toLowerCase().replace(/-/g, " ");

    // check for phrase match (substring) or single-word match (Set)
    if (
      normalizedIngredients.includes(allergenNormalized) || // phrase/substring match
      ingredientsSet.has(allergenNormalized) // single-word match
    ) {
      allergensDetected.push(allergen); // add to detected allergens
    }
  }
  // return detected allergens
  return allergensDetected;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
