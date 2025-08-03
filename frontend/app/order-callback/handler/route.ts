import { ORDER_STATUS, PAYMENT_STATUS } from "@/enums/OrderStatus";
import {
  getPaymentStatusByTransactionId,
  updateOrderStatus,
} from "@/sanity/services/OrderService";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { response } = await req.json();
    const decodedResponse = Buffer.from(response, "base64").toString();
    const jsonResponse = JSON.parse(decodedResponse);
    const merchantTransactionId = jsonResponse.data.merchantTransactionId;
    if (jsonResponse.success == true) {
      const paymentMethod = jsonResponse.data.paymentInstrument.type;
      await updateOrderStatus(merchantTransactionId, {
        paymentStatus: PAYMENT_STATUS[PAYMENT_STATUS.SUCCESSFULL],
        paymentMethod: paymentMethod,
      });
    } else {
      await updateOrderStatus(merchantTransactionId, {
        paymentStatus: PAYMENT_STATUS[PAYMENT_STATUS.FAILED],
        orderStatus: ORDER_STATUS[ORDER_STATUS.CANCELLED],
      });
    }
    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Retrieve paymentId from the URL parameters
    const transactionId = req.nextUrl.searchParams.get("transactionId");
    if (!transactionId)
      return NextResponse.json({
        success: false,
        paymentStatus: "Failed to process the request",
        status: 500,
      });
    const paymentStatus = await getPaymentStatusByTransactionId(transactionId);
    if (!paymentStatus) {
      return NextResponse.json({
        success: true,
        paymentStatus: `No order exists with id : ${transactionId}`,
        status: 400,
      });
    }
    return NextResponse.json({
      success: true,
      paymentStatus: paymentStatus,
      status: 200,
    });
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json({
      success: false,
      paymentStatus: "Failed to process the request",
      status: 500,
    });
  }
}
