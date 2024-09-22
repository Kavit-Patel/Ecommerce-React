// import { ICart } from "../types/types";

// export const calcCartItemDiffLsDs = (
//   cartItemsLs: ICart[],
//   cartItemsDb: ICart[],
//   userId: string | undefined
// ) => {
//   return cartItemsLs
//     .filter((item) => item.user === userId)
//     .filter(
//       (lsItem) =>
//         !cartItemsDb.some(
//           (dbItem) =>
//             dbItem.product._id === lsItem.product._id &&
//             dbItem.user === lsItem.user
//         )
//     );
// };
// export const calcCartItemQuantityDiffLsDs = (
//   cartItemsLs: ICart[],
//   cartItemsDb: ICart[],
//   userId: string | undefined
// ) => {
//   return cartItemsLs
//     .filter((item) => item.user === userId)
//     .filter((lsItem) => {
//       return cartItemsDb.some(
//         (dbItem) =>
//           dbItem._id === lsItem._id &&
//           dbItem.user === lsItem.user &&
//           dbItem.quantity !== lsItem.quantity
//       );
//     });
// };
