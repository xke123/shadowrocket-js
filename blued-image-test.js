const headers = $response.headers || {};

const contentType =
  headers["Content-Type"] ||
  headers["content-type"] ||
  "unknown";

let size = 0;

if ($response.bodyBytes) {
  size = $response.bodyBytes.byteLength || 0;
}

console.log(
  `[BluedImage] type=${contentType}, size=${size} bytes, url=${$request.url}`
);

// Keep the original response unchanged.
$done({});
