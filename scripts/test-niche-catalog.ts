async function main() {
  const urls = [
    'https://shopifyapp.up.railway.app/blank-theme.zip',
    'https://shopifyapp.up.railway.app/base-theme.zip',
    'https://raw.githubusercontent.com/UMANGSATNAM/convertkit-convertflow/main/public/blank-theme.zip'
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`URL: ${url} -> Status: ${res.status} | Content-Type: ${res.headers.get('content-type')} | Content-Length: ${res.headers.get('content-length')}`);
    } catch (err: any) {
      console.error(`URL: ${url} failed -> ${err.message}`);
    }
  }
}
main();
