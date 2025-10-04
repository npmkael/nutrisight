export const getRecommendedWeightRangeFeetAndInches = (
  heightFeet: number,
  heightInches: number,
  weightInKg: number
) => {
  // convert height to cm and calculate desired weight
  const heightFeetToInches = heightFeet * 12;
  const totalHeightInches = heightFeetToInches + heightInches;

  const heightInchesToCm = totalHeightInches * 2.54;
  const heightInchesToCmLess100 = heightInchesToCm - 100;
  const heightInchesToCmLess100MultipledBy0_1 = 0.1 * heightInchesToCmLess100;

  const desiredWeight = Math.round(
    heightInchesToCmLess100 - heightInchesToCmLess100MultipledBy0_1
  );

  let recommendation = "";

  const desiredWeightInLessThan10Percent = Math.round(desiredWeight * 0.9);
  const desiredWeightInMoreThan10Percent = Math.round(desiredWeight * 1.1);

  if (weightInKg < desiredWeightInLessThan10Percent) {
    recommendation = "underweight";
  } else if (weightInKg > desiredWeightInMoreThan10Percent) {
    recommendation = "overweight";
  }

  return {
    desiredWeight,
    recommendation,
    desiredWeightInLessThan10Percent,
    desiredWeightInMoreThan10Percent,
  };
};

export const getRecommendedWeightRangeCm = (heightCm: number) => {
  const heightInchesToCmLess100 = heightCm - 100;
  const heightInchesToCmLess100MultipledBy0_1 = 0.1 * heightInchesToCmLess100;

  const desiredWeight =
    heightInchesToCmLess100 - heightInchesToCmLess100MultipledBy0_1;

  return desiredWeight;
};

export const ftToCM = (ft: string, inch: string) => {
  const ftIn = Number(ft) * 12;
  const totalIn = ftIn + Number(inch);
  const cm = totalIn * 2.54;
  return cm;
};

export const cmToFt = (cm: string) => {
  const totalIn = Number(cm) / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inch = Math.round(totalIn % 12);
  return { ft, inch };
};

export const kgToLb = (kg: string) => {
  return Math.round(Number(kg) * 2.20462);
};

export const lbToKg = (lb: string) => {
  return Math.round(Number(lb) / 2.20462);
};
