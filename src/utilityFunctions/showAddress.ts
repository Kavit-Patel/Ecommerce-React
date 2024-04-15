import { addressType } from "../types/types";

export const showAddress = (address: addressType | undefined) => {
  if (address) {
    const { street, city, state, zipcode, country } = address;

    return `${street},${city},${state} ${zipcode} \n ${country}`;
  }
  return `no - address`;
};
