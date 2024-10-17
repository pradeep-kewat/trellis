"use server";

import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

export const GetSignedURL = async () => {
  try {
    const response = getSignedUrl({
      // url: "https://d103ez9fpb6ebz.cloudfront.net/dev/posts/1726143139509_image (3).png",
      // url: "https://d103ez9fpb6ebz.cloudfront.net/dev/profile/Screenshot+2024-09-22+140620.png",
      url: "https://d103ez9fpb6ebz.cloudfront.net/dev/profile/68cc5341-c4f2-43e7-a55f-5b54849cd92d/1727773506370.png",
      dateLessThan: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
      privateKey: process.env.PRIVATE_CLOUDFRONT_KEY || "",
      keyPairId: process.env.PRIVATE_CLOUDFRONT_KEY_PAIR_ID || "",
    });
    return { success: true, data: response };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "An unknown error occurred",
    };
  }
};
