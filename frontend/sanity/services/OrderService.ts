"use server";
import { Order, OrderProduct } from "@/interfaces/Order";
import { client, urlFor } from "../client";
import { GET_ORDER_BY_EMAIL_QUERY } from "../queries/OrderQueries";
import { nanoid } from "nanoid";

export async function createOrder(order: Order): Promise<string> {
  const createdOrder = await client.create({
    _type: "order",
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    emailId: order.emailId,
    transactionId: order.transactionId,
    shippingAddress: order.shippingAddress,
    products: order.products.map((item) => ({
      quantity: item.quantity,
      _key: nanoid(),
      product: {
        _type: "reference",
        _ref: item._id,
      },
    })),
  });

  return createdOrder._id;
}

export const getOrdersByEmail = async (
  email: string,
  offset = 0,
  limit = 10
) => {
  const query = `*[_type == "order" && emailId == $email] | order(_createdAt desc) [${offset}...${offset + limit}] {
  _id,
  _createdAt,
  orderStatus,
  paymentStatus,
  transactionId,
  shippingAddress,
  products[] {
    quantity,
    product->{
      _id,
      title,
      slug,
      coverImage,
      price,
      volume
    }
  }
}`;

  const countQuery = `count(*[_type == "order" && emailId == $email])`;

  const [orders, total] = await Promise.all([
    client.fetch(query, { email }),
    client.fetch(countQuery, { email }),
  ]);

  orders.forEach((order: Order) => {
    order.products?.forEach((item: OrderProduct) => {
      if (item?.coverImage) {
        item.coverImage = urlFor(item.coverImage);
      }
    });
  });

  return { orders, total };
};

export async function updateOrderStatus(
  transactionId: string,
  updates: {
    orderStatus?: string;
    paymentStatus?: string;
    paymentMethod?: string;
  }
) {
  // Step 1: Fetch the document _id using transactionId
  const query = `*[_type == "order" && transactionId == $transactionId][0]{_id}`;
  const params = { transactionId };
  const result = await client.fetch(query, params);
  if (!result?._id) {
    throw new Error(`Order with transactionId "${transactionId}" not found`);
  }

  // Step 2: Patch the order using its _id
  return await client
    .patch(result._id)
    .set({
      ...(updates.orderStatus && { orderStatus: updates.orderStatus }),
      ...(updates.paymentStatus && { paymentStatus: updates.paymentStatus }),
      ...(updates.paymentMethod && { paymentMethod: updates.paymentMethod }),
    })
    .commit();
}

export async function getPaymentStatusByTransactionId(transactionId: string) {
  const paymentStatus = await client.fetch(
    `*[_type == "order" && transactionId == $transactionId][0]{ paymentStatus }`,
    { transactionId: transactionId }
  );
  return paymentStatus.paymentStatus;
}
