export async function getFacebookBlendedCac(merchantDetails: any, date: Date): Promise<number> {
  // Real implementation fetches daily ad spend from Meta Graph API
  // and divides by the total number of orders that day.
  
  if (!merchantDetails.facebookAccessToken) {
    // Return a mocked CAC for demo (Rs. 150 - 400 per order)
    return Math.floor(Math.random() * 250) + 150;
  }

  try {
    // Simulated fetch
    // const response = await fetch(`https://graph.facebook.com/v19.0/act_${merchantDetails.facebookAdAccountId}/insights?time_range={'since':'${date}','until':'${date}'}`, {
    //   headers: {
    //     Authorization: `Bearer ${merchantDetails.facebookAccessToken}`
    //   }
    // });
    // const data = await response.json();
    // const spend = data.data[0].spend;
    // return (spend / totalOrdersForDay);

    return Math.floor(Math.random() * 250) + 150;
  } catch (error) {
    console.error("Facebook API Error:", error);
    return 200; // Fallback
  }
}
