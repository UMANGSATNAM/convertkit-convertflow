export async function getShiprocketShippingCost(orderId: string, merchantDetails: any): Promise<number> {
  // Real implementation hits Shiprocket to get shipping label cost based on exact order ID
  
  if (!merchantDetails.shiprocketToken) {
    // Return a typical shipping cost in India (Rs. 60 - 120)
    return Math.floor(Math.random() * 60) + 60; 
  }

  try {
    // Simulated fetch
    // const response = await fetch(`https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`, {
    //   headers: {
    //     Authorization: `Bearer ${merchantDetails.shiprocketToken}`
    //   }
    // });
    // const data = await response.json();
    // return data.data.freight_charge || 80;

    return Math.floor(Math.random() * 60) + 60;
  } catch (error) {
    console.error("Shiprocket API Error:", error);
    return 80; // Fallback
  }
}
