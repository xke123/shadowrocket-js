const headers = $response.headers || {};

const contentType =
  headers["Content-Type"] ||
  headers["content-type"] ||
  "unknown";

const body = $response.body;
const bodyBytes = $response.bodyBytes;

function safeLength(value) {
  if (value == null) return 0;

  if (typeof value === "string") {
    return value.length;
  }

  if (typeof value.byteLength === "number") {
    return value.byteLength;
  }

  if (typeof value.length === "number") {
    return value.length;
  }

  return 0;
}

function describe(value) {
  if (value == null) return "null";

  let ctor = "unknown";
  try {
    ctor = value.constructor && value.constructor.name
      ? value.constructor.name
      : "unknown";
  } catch (_) {}

  return `type=${typeof value}, ctor=${ctor}, length=${safeLength(value)}`;
}

console.log(
  `[BluedImage] contentType=${contentType}, url=${$request.url}`
);

console.log(
  `[BluedImage] body: ${describe(body)}`
);

console.log(
  `[BluedImage] bodyBytes: ${describe(bodyBytes)}`
);

console.log(
  `[BluedImage] headers=${JSON.stringify(headers)}`
);

// Diagnostic only: do not modify the original image response.
$done({});
