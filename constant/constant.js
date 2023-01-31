export const pushMessage = {
  dolarUp: (value) => ({
    title: "¡Dolar Blue! aumento su precio.",
    body: `$${value} pesos por dolar.`,
  }),
  dolarDown: (value) => ({
    title: "¡Dolar Blue! bajo su precio.",
    body: `$${value} pesos por dolar.`,
  }),
};
