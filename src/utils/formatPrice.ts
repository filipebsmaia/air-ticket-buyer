const numberFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatPrice = (value: number) => {
  return numberFormatter.format(value);
};
