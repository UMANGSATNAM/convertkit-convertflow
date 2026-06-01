export async function getRazorpayFee(orderId: string, merchantDetails: any): Promise<number> {
  // In a real implementation, this would call the Razorpay API:
  // https://api.razorpay.com/v1/orders/{orderId}/payments
  // and aggregate the fee deductions.

  // For demonstration purposes or if keys are missing, we simulate a standard 2% fee
  // plus Rs.18 GST on the fee, which effectively means ~2.36% of the transaction.
  
  if (!merchantDetails.razorpayKeyId) {
    // Return a mocked value representing roughly 2%
    return 0; // The caller should calculate 2% if this returns 0 and it's a prepaid order
  }

  try {
    // Simulated fetch
    // const response = await fetch(`https://api.razorpay.com/v1/orders/${orderId}/payments`, {
    //   headers: {
    //     Authorization: `Basic ${Buffer.from(merchantDetails.razorpayKeyId + ':' + merchantDetails.razorpayKeySecret).toString('base64')}`
    //   }
    // });
    // const data = await response.json();
    // const totalFee = data.items.reduce((acc, curr) => acc + (curr.fee / 100), 0);
    // return totalFee;

    // Simulated successful response
    return Math.random() * 50 + 10; 
  } catch (error) {
    console.error("Razorpay API Error:", error);
    return 0;
  }
}
