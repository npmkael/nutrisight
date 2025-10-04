export const getRecommendedWeightRangeFeetAndInches = (
  heightFeet: number,
  heightInches: number
) => {
  // convert height to cm and calculate desired weight
  const heightFeetToInches = heightFeet * 12;
  const totalHeightInches = heightFeetToInches + heightInches;

  const heightInchesToCm = totalHeightInches * 2.54;
  const heightInchesToCmLess100 = heightInchesToCm - 100;
  const heightInchesToCmLess100MultipledBy0_1 = 0.1 * heightInchesToCmLess100;

  const desiredWeight =
    heightInchesToCmLess100 - heightInchesToCmLess100MultipledBy0_1;

  return desiredWeight;
};

export const getRecommendedWeightRangeCm = (heightCm: number) => {
  const heightInchesToCmLess100 = heightCm - 100;
  const heightInchesToCmLess100MultipledBy0_1 = 0.1 * heightInchesToCmLess100;

  const desiredWeight =
    heightInchesToCmLess100 - heightInchesToCmLess100MultipledBy0_1;

  return desiredWeight;
};

export const convertCmToFeetAndInches = (cm: number) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = (totalInches % 12).toFixed(0);
  return { feet, inches };
};

export const convertFeetAndInchesToCm = (feet: number, inches: number) => {
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
};

export const convertKgToLbs = (kg: number) => {
  return Math.round(kg * 2.20462);
};

export const convertLbsToKg = (lbs: number) => {
  return Math.round(lbs * 0.453592);
};
