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

export function replaceUnderscoreWithSpace(str: string) {
  return str.replace(/_/g, " ");
}

// Chunk into groups of 6 for the slider
export function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Example usage:
// const date = new Date("1995-12-25");
// const formatted = formatDateToMMDDYYYY(date); // "12-25-1995"
export function formatDateToMMDDYYYY(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

// const date = parseMMDDYYYYToDate("12-25-1995"); // Date object for December 25, 1995
export function parseMMDDYYYYToDate(dateStr: string): Date | null {
  // Expects dateStr in "MM-DD-YYYY" format
  const [mm, dd, yyyy] = dateStr.split("-");
  if (!mm || !dd || !yyyy) return null;
  // Note: Months are 0-based in JS Date
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

export function getAgeFromDOB(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function cmToFeetAndInches(cm: number) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = +(totalInches % 12).toFixed(2);
  return { feet, inches };
}

// Convert lbs to kg
export function lbsToKg(lbs: number) {
  return +(lbs * 0.45359237).toFixed(2);
}

export function removeDuplicateTriggeredAllergens(
  triggeredAllergens: { allergen: string; ingredient: string }[]
) {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const i of triggeredAllergens) {
    const allergenLower = i.allergen.toLowerCase();
    if (!seen.has(allergenLower)) {
      seen.add(allergenLower);
      unique.push(i.allergen); // keep original casing if you want
    }
  }
  return unique;
}
