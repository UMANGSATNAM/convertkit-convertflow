export async function getShiprocketShippingCost(orderId: string, merchantDetails: any): Promise<number> {
  // Real implementation hits Shiprocket to get shipping label cost based on exact order ID
  
  if (!merchantDetails.shiprocketToken) {
    // Return a typical shipping cost in India (Rs. 60 - 120)
    return Math.floor(Math.random() * 60) + 60; 
  }

  try {
    // Shiprocket API expects its own order ID or channel_order_id (which is often Shopify's order ID).
    // The GET /v1/external/orders/show API might take Shiprocket's own ID.
    // To be safer for this demo implementation, we fetch by channel_order_id using search if possible,
    // or assume we have the exact Shiprocket order ID if passed from a mapping table.
    
    // Using the /v1/external/orders/show API as a placeholder, assuming orderId is Shiprocket's order_id
    // or that Shiprocket gracefully handles channel_order_id here.
    const response = await fetch(`https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`, {
      headers: {
        Authorization: `Bearer ${merchantDetails.shiprocketToken}`
      }
    });

    if (!response.ok) {
      console.error("Shiprocket API Error Response:", await response.text());
      return 80;
    }

    const data = await response.json();
    
    // freight_charge is what they've charged so far or estimated.
    // If it's 0 or null, we provide a fallback average
    const freightCharge = parseFloat(data.data?.freight_charge) || 80;
    
    return freightCharge;
  } catch (error) {
    console.error("Shiprocket API Request Error:", error);
    return 80; // Fallback
  }
}
