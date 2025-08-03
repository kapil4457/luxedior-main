import { OrderProduct, ShippingAddress } from "@/interfaces/Order";

export const storeProductsToBuyInLocalStorage = (products: OrderProduct[]) => {
  localStorage.setItem("PRODUCTS_TO_BUY", JSON.stringify(products));
};
export const removeProductsToBuyFromLocalStorage = () => {
  localStorage.removeItem("PRODUCTS_TO_BUY");
  localStorage.removeItem("ORDER_TRANSACTION_ID");
  localStorage.removeItem("ORDER_ID");
  localStorage.removeItem("ORDER_SHIPPING_ADDRESS");
};
export const getProductsToBuyFromLocalStorage = (): OrderProduct[] | null => {
  let stringifiedProducts = localStorage.getItem("PRODUCTS_TO_BUY");
  if (!stringifiedProducts) {
    return null;
  }
  let products: OrderProduct[] = JSON.parse(stringifiedProducts);
  return products;
};

export const getOrderShippingAddressFromLocalStorage =
  (): ShippingAddress | null => {
    let shippingAddressStringified = localStorage.getItem(
      "ORDER_SHIPPING_ADDRESS"
    );
    if (!shippingAddressStringified) {
      return null;
    }
    let shippingAddress: ShippingAddress = JSON.parse(
      shippingAddressStringified
    );
    return shippingAddress;
  };
