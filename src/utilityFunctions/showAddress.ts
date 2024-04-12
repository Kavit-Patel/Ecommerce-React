import { addressType } from "../types/types";

export const showAddress = (address: addressType) => {
  const { street, city, state, zipcode, country } = address;

  return `${street},${city},${state} ${zipcode} \n ${country}`;
};
