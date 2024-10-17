const enumsToValue = [
  { eighteen_to_thirty: "18-30" },
  { thirty_one_to_fourty_five: "30-45" },
  { fourty_six_to_sixty: "46-60" },
  { sixty_plus: "60+" },
  { soft_delete: "Soft Delete" },
];

type EnumLookup = {
  [key: string]: string;
};
const lookup: EnumLookup = enumsToValue.reduce((acc, enumObj) => {
  return { ...acc, ...enumObj };
}, {});

export const ParseEnum = (input: string) => {
  const value = lookup[input] || input;
  if (value == null || Array.isArray(value)) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};
