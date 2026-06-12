export async function graphqlRequest(shopDomain: string, accessToken: string, query: string, variables: any = {}) {
  const url = `https://${shopDomain}/admin/api/2024-04/graphql.json`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();
  
  if (data.errors) {
    console.error("GraphQL Error:", JSON.stringify(data.errors, null, 2));
    throw new Error(`Shopify GraphQL Error: ${data.errors[0].message}`);
  }

  return data.data;
}

export async function restRequest(shopDomain: string, accessToken: string, method: string, path: string, body?: any) {
  const url = `https://${shopDomain}/admin/api/2024-04/${path}`;
  
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`REST Error (${response.status}):`, text);
    throw new Error(`Shopify REST Error: ${response.status} - ${text}`);
  }

  return response.json();
}
