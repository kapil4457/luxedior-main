"use server";
import shajs from "sha.js";
import axios from "axios";

export async function redirectPayment(price: number, emailId: string) {
  try {
    // console.log("inside redirect payment");
    const MERCHANT_ID = process.env.PHONE_PAY_MERCHANT_ID;
    const PHONE_PE_HOST_URL = process.env.PHONE_PAY_LINK;
    const SALT_INDEX = process.env.PHONE_PAY_SALT_INDEX;
    const SALT_KEY = process.env.PHONE_PAY_SALT_KEY;
    const APP_BE_URL_REDIRECT_URL = process.env.APP_BE_URL_REDIRECT_URL;
    const APP_BE_URL_CALLBACK_URL = process.env.APP_BE_URL_CALLBACK_URL;
    // console.log("MERCHANT_ID : ", MERCHANT_ID);
    // console.log("PHONE_PE_HOST_URL : ", PHONE_PE_HOST_URL);
    // console.log("SALT_INDEX : ", SALT_INDEX);
    // console.log("SALT_KEY : ", SALT_KEY);
    // console.log("APP_BE_URL_REDIRECT_URL : ", APP_BE_URL_REDIRECT_URL);
    // console.log("APP_BE_URL_CALLBACK_URL : ", APP_BE_URL_CALLBACK_URL);
    const merchantTransactionId = "M" + Date.now();
    let normalPayLoad = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: emailId,
      amount: price * 100,
      redirectUrl: APP_BE_URL_REDIRECT_URL,
      callbackUrl: APP_BE_URL_CALLBACK_URL,
      redirectMode: "REDIRECT",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    // console.log("merchantTransactionId : ", merchantTransactionId);
    // console.log("normalPayLoad : ", normalPayLoad);

    let bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
    // console.log("bufferObj : ", bufferObj);
    let base64EncodedPayload = bufferObj.toString("base64");
    // console.log("base64EncodedPayload : ", base64EncodedPayload);

    let string = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
    const sha256_val = shajs("sha256").update(string).digest("hex");
    let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;
    // console.log("xVerifyChecksum : ", xVerifyChecksum);
    const data = {
      request: base64EncodedPayload,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerifyChecksum,
        accept: "application/json",
      },
    };
    // console.log("config : ", config);
    const { data: serverData } = await axios.post(
      PHONE_PE_HOST_URL!,
      data,
      config
    );
    // console.log("serverData : ", serverData);

    const { instrumentResponse } = serverData.data;
    return {
      redirectUrl: instrumentResponse.redirectInfo.url,
      message: "Initializing payment...",
      success: true,
      merchantTransactionId: merchantTransactionId,
    };
  } catch (error: any) {
    // console.log(error);
    return {
      success: false,
      message: error.message,
      redirectUrl: "",
    };
  }
}
