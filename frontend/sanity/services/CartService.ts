"use server";
import { client, urlFor } from "../client";
import { GET_CART_BY_EMAIL_QUERY } from "../queries/CartQueries";

import { CartItem } from "@/interfaces/Cart";

interface CartResponseItem {
  _key: string;
  product: {
    _ref: string;
    _type: string;
  };
  quantity: number;
}

export async function addOrUpdateProductInCart(
  emailId: string,
  slug: string,
  quantity: number
) {
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{ _id }`,
    { slug }
  );

  if (!product) {
    throw new Error("Product not found for given slug");
  }

  const productId = product._id;
  const cart = await client.fetch(
    `*[_type == "cart" && emailId == $emailId][0]`,
    { emailId }
  );

  if (!cart) {
    const newCart = {
      _type: "cart",
      emailId,
      products: [
        {
          _key: `${productId}-${Date.now()}`,
          product: { _type: "reference", _ref: productId },
          quantity,
        },
      ],
    };
    const created = await client.create(newCart);

    return created;
  } else {
    const productIndex = cart.products.findIndex(
      (item: any) => item.product._ref === productId
    );

    if (productIndex !== -1) {
      const updatedQuantity = cart.products[productIndex].quantity + quantity;

      const patch = {
        [`products[${productIndex}].quantity`]: updatedQuantity,
      };

      const updated = await client.patch(cart._id).set(patch).commit();

      return updated;
    } else {
      const updated = await client
        .patch(cart._id)
        .insert("after", "products[-1]", [
          {
            _key: `${productId}-${Date.now()}`,
            product: { _type: "reference", _ref: productId },
            quantity,
          },
        ])
        .commit();

      return updated;
    }
  }
}
export async function updateCartItemQuantity(
  emailId: string,
  productId: string,
  quantity: number
) {
  // Fetch the cart by emailId
  const cart = await client.fetch<{
    _id: string;
    products: CartResponseItem[];
  }>(`*[_type == "cart" && emailId == $emailId][0]`, { emailId });

  if (!cart) throw new Error("Cart not found");

  const updatedProducts = cart.products.map((item) => {
    if (item.product._ref === productId) {
      return { ...item, quantity };
    }

    return item;
  });

  const updated = await client
    .patch(cart._id) // patch by the fetched cart ID
    .set({ products: updatedProducts })
    .commit();

  return updated;
}

export async function getCartByEmail(emailId: string) {
  var res = await client.fetch(GET_CART_BY_EMAIL_QUERY, { emailId });
  var cartItems: CartItem[] = res?.products?.map((product: any) => {
    var item: CartItem = {
      coverImage: urlFor(product.product.coverImage).url(),
      price: product.product.price,
      slug: product.product.slug.current,
      quantity: product.quantity,
      title: product.product.title,
      _refId: product.product._id,
      stockAvailable: product.product.stock,
    };

    return item;
  });

  return cartItems;
}

export async function removeProductFromCart(
  emailId: string,
  productId: string
) {
  // Fetch the cart by emailId
  const cart = await client.fetch<{
    _id: string;
    products: CartResponseItem[];
  }>(`*[_type == "cart" && emailId == $emailId][0]`, { emailId });

  if (!cart) throw new Error("Cart not found");

  const updatedProducts = cart.products.filter(
    (item) => item.product._ref !== productId
  );

  const updated = await client
    .patch(cart._id)
    .set({ products: updatedProducts })
    .commit();

  return updated;
}

export async function clearUserCart(emailId: string) {
  const cart = await client.fetch(
    `*[_type == "cart" && emailId == $emailId][0]`,
    { emailId }
  );

  if (!cart?._id) {
    console.warn(`No cart found for email: ${emailId}`);

    return;
  }

  await client.patch(cart._id).unset(["products"]).commit();
}
