export async function getRazorpayFee(orderId: string, merchantDetails: any): Promise<number> {
  // In a real implementation, this would call the Razorpay API:
  // https://api.razorpay.com/v1/orders/{orderId}/payments
  // and aggregate the fee deductions.

  // For demonstration purposes or if keys are missing, we simulate a standard 2% fee
  // plus Rs.18 GST on the fee, which effectively means ~2.36% of the transaction.
  
  if (!merchantDetails.razorpayKeyId || !merchantDetails.razorpayKeySecret) {
    return 0;
  }

  try {
    // Note: We need the Razorpay order ID to fetch payments for it.
    // However, Shopify order IDs are different from Razorpay order IDs.
    // Razorpay payment ID is usually stored in Shopify's order transaction data.
    // For this implementation, since we only have shopifyOrderId, we assume
    // orderId passed here is actually the Razorpay Order ID or Payment ID if available.
    // If it's a shopify order ID, we would ideally query shopify transactions first.
    // We'll try to fetch by Razorpay order ID first.
    const response = await fetch(`https://api.razorpay.com/v1/orders/${orderId}/payments`, {
      headers: {
        Authorization: `Basic ${Buffer.from(merchantDetails.razorpayKeyId + ':' + merchantDetails.razorpayKeySecret).toString('base64')}`
      }
    });

    if (!response.ok) {
      console.error("Razorpay API Error Response:", await response.text());
      return 0;
    }

    const data = await response.json();
    
    // Razorpay amounts and fees are in paise (cents). Need to divide by 100 for INR.
    let totalFee = 0;
    if (data.items && Array.isArray(data.items)) {
      totalFee = data.items.reduce((acc: number, curr: any) => {
        // Fee includes GST
        const feeInInr = (curr.fee || 0) / 100;
        return acc + feeInInr;
      }, 0);
    }
    
    return totalFee;
  } catch (error) {
    console.error("Razorpay API Request Error:", error);
    return 0;
  }
}
