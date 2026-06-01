import { getRazorpayFee } from "./integrations/razorpay.server";
import { getShiprocketShippingCost } from "./integrations/shiprocket.server";
import { getFacebookBlendedCac } from "./integrations/facebook-ads.server";
import prisma from "../db.server";

export async function calculateOrderProfit(shopifyOrderId: bigint, sellingPrice: number, merchantDetails: any) {
  // Configurable Merchant Variables
  // In a real scenario, COGS would be pulled from a separate model keyed by Product ID
  // and RTO/Packaging from Merchant settings.
  const estimatedCogs = sellingPrice * 0.3; // Assume 30% COGS for now
  const packagingCost = 25; // Rs. 25 flat
  const rtoBuffer = sellingPrice * 0.05; // 5% RTO buffer
  
  // Live Integrations
  const pgFee = await getRazorpayFee(shopifyOrderId.toString(), merchantDetails);
  const shippingCost = await getShiprocketShippingCost(shopifyOrderId.toString(), merchantDetails);
  const adSpendAttributed = await getFacebookBlendedCac(merchantDetails, new Date());

  // Calculation
  const totalCost = estimatedCogs + packagingCost + rtoBuffer + pgFee + shippingCost + adSpendAttributed;
  const netProfit = sellingPrice - totalCost;
  const netMarginPct = (netProfit / sellingPrice) * 100;

  // Save to Database
  return prisma.profitSnapshot.create({
    data: {
      merchantId: merchantDetails.id,
      shopifyOrderId,
      sellingPrice,
      cogs: estimatedCogs,
      shippingCost,
      pgFee,
      adSpendAttributed,
      packagingCost,
      rtoBuffer,
      netProfit,
      netMarginPct,
      roas: (sellingPrice / adSpendAttributed)
    }
  });
}

export async function generateMockProfitData(merchantId: string) {
  // Generates 15 days of dummy profit data for the dashboard
  const snapshots = [];
  for (let i = 0; i < 15; i++) {
    const sellingPrice = Math.floor(Math.random() * 2000) + 500;
    const adSpendAttributed = Math.floor(Math.random() * 250) + 150;
    const shippingCost = Math.floor(Math.random() * 60) + 60;
    const pgFee = sellingPrice * 0.02;
    const estimatedCogs = sellingPrice * 0.3;
    const packagingCost = 25;
    const rtoBuffer = sellingPrice * 0.05;
    
    const totalCost = estimatedCogs + packagingCost + rtoBuffer + pgFee + shippingCost + adSpendAttributed;
    const netProfit = sellingPrice - totalCost;
    const netMarginPct = (netProfit / sellingPrice) * 100;

    snapshots.push({
      merchantId,
      shopifyOrderId: BigInt(Date.now() + i),
      sellingPrice,
      cogs: estimatedCogs,
      shippingCost,
      pgFee,
      adSpendAttributed,
      packagingCost,
      rtoBuffer,
      netProfit,
      netMarginPct,
      roas: (sellingPrice / adSpendAttributed),
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000) // subtract i days
    });
  }

  await prisma.profitSnapshot.createMany({
    data: snapshots,
    skipDuplicates: true
  });
}
