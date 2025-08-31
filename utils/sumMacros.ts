export function sumMacros(
  arr: { name: string; amount: number; unit: string }[]
) {
  const output = {
    totalFat: 0,
    totalCarbs: 0,
    protein: 0,
  };

  for (const n of arr) {
    if (n.name.toLowerCase().includes("fat")) {
      output.totalFat += n.amount;
    } else if (n.name.toLowerCase().includes("carb")) {
      output.totalCarbs += n.amount;
    } else if (n.name.toLowerCase().includes("protein")) {
      output.protein += n.amount;
    }
  }
  return output;
}
