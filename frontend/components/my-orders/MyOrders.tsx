import { getOrdersByEmail } from "@/sanity/services/OrderService";
import { useClerk, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { Order, OrderProduct } from "@/interfaces/Order";
import { Link } from "@heroui/link";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";

const MyOrders = () => {
  const [offset, setOffset] = useState(0);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const [isLoading, setIsLoading] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [page, setPage] = useState(0);

  const PAGE_SIZE = 10;
  const getAllOrders = async () => {
    setIsLoading(true);
    if (!isLoaded) return;
    if (isLoaded && !isSignedIn) {
      openSignIn();
      return;
    }
    var emailAddress = user?.primaryEmailAddress?.emailAddress;
    if (!emailAddress) return;
    const { orders, total } = await getOrdersByEmail(
      emailAddress,
      offset,
      PAGE_SIZE
    );
    setOrders(orders);
    setOrderCount(total);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllOrders();
  }, [offset]);

  if (isLoading || !isLoaded)
    return (
      <div className="w-full flex justify-center items-center h-[50vh]">
        <Spinner
          color="warning"
          label="Loading your orders..."
          labelColor="warning"
        />
      </div>
    );
  if (isLoaded && !isSignedIn) {
    router.push("/");
    addToast({
      title: "Please login to access this page",
      variant: "solid",
      color: "danger",
    });
  }
  return (
    <div>
      {orders?.length == 0 ? (
        <div className="flex flex-col items-center justify-center h-80 text-center">
          <p className="text-xl font-semibold text-gray-300">No orders yet</p>
          <p className="text-sm text-gray-500 mt-1">
            You haven’t placed any orders. Once you do, they’ll show up here.
          </p>
          <div className="h-1 w-20 bg-yellow-400 rounded mt-4" />
        </div>
      ) : (
        <>
          <Table className="!bg-[#191A1C] !text-gray-500">
            <TableHeader className="bg-[#222] text-gray-800">
              <TableColumn>Order ID</TableColumn>
              <TableColumn>Products</TableColumn>
              <TableColumn>Payment Status</TableColumn>
              <TableColumn>Order Status</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>Total</TableColumn>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                    </TableRow>
                  ))
                : orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="text-sm">
                        {order?.transactionId?.slice(-8)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order?.products?.map((p: OrderProduct) => {
                          return (
                            <p key={p?._id}>
                              <Link
                                className="text-sm"
                                href={`/product/${p?.product?.slug?.current}`}
                              >
                                {p?.product?.title}
                              </Link>
                              × {p.quantity}
                            </p>
                          );
                        })}
                      </TableCell>
                      <TableCell>{order?.paymentStatus}</TableCell>
                      <TableCell>{order?.orderStatus}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(order?._createdAt ?? "").toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        ₹
                        {order?.products
                          .reduce(
                            (acc, p) =>
                              acc + (p?.product?.price || 0) * p.quantity,
                            0
                          )
                          .toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <Button
              variant="solid"
              disabled={page === 0}
              onPress={() => {
                setOffset((offset) => Math.max(0, offset - PAGE_SIZE));
                setPage((p) => Math.max(p - 1, 0));
              }}
            >
              Previous
            </Button>
            <p className="text-gray-400">
              Page {page + 1} of {Math.ceil(orderCount / PAGE_SIZE)}
            </p>
            <Button
              variant="solid"
              disabled={(page + 1) * PAGE_SIZE >= orderCount}
              onPress={() => {
                setOffset((offset) => Math.max(0, offset + PAGE_SIZE));
                setPage((p) => Math.max(p + 1));
              }}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
