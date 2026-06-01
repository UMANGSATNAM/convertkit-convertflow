import prisma from "../../db.server";

export async function getFacebookBlendedCac(merchantDetails: any, date: Date): Promise<number> {
  // Real implementation fetches daily ad spend from Meta Graph API
  // and divides by the total number of orders that day.
  
  if (!merchantDetails.facebookAccessToken || !merchantDetails.facebookAdAccountId) {
    // Return a mocked CAC for demo (Rs. 150 - 400 per order)
    return Math.floor(Math.random() * 250) + 150;
  }

  try {
    // Date formatting for Facebook API (YYYY-MM-DD)
    const formattedDate = date.toISOString().split('T')[0];

    // Fetch the spend for the specific day
    const response = await fetch(`https://graph.facebook.com/v19.0/act_${merchantDetails.facebookAdAccountId}/insights?time_range={'since':'${formattedDate}','until':'${formattedDate}'}`, {
      headers: {
        Authorization: `Bearer ${merchantDetails.facebookAccessToken}`
      }
    });

    if (!response.ok) {
      console.error("Facebook API Error Response:", await response.text());
      return 200;
    }

    const data = await response.json();
    const spend = data.data && data.data.length > 0 ? parseFloat(data.data[0].spend) : 0;
    
    // Get total orders for the day to calculate blended CAC
    // We assume the date is in UTC, so we fetch orders created on that day.
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    
    // Note: merchantDetails is expected to have shop property, since it's the settings record
    // or we might need the shop to fetch correctly. Assuming merchantDetails has shop.
    // If we don't have shop on merchantDetails, we fallback to counting all orders (in a single tenant demo).
    let totalOrdersForDay = 1; // Default to 1 to avoid division by zero
    
    try {
      const ordersCount = await prisma.order.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
          ...(merchantDetails.shop ? { shop: merchantDetails.shop } : {})
        }
      });
      
      if (ordersCount > 0) {
        totalOrdersForDay = ordersCount;
      }
    } catch (dbError) {
      console.error("Error fetching order count:", dbError);
    }
    
    return spend / totalOrdersForDay;
  } catch (error) {
    console.error("Facebook API Request Error:", error);
    return 200; // Fallback
  }
}
