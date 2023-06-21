export const calculePrice = (value: number) => {
  return {
    common: value,
    executive: value * 1.3,
  };
};
