const headers = $response.headers || {};

const contentType = (
  headers["Content-Type"] ||
  headers["content-type"] ||
  ""
).toLowerCase();

const body = $response.body;

// Mac receiver. Change this only if your Mac LAN IP changes.
const UPLOAD_URL = "http://192.168.1.210:8080/upload";

function getLength(value) {
  if (value == null) return 0;
  if (typeof value.byteLength === "number") return value.byteLength;
  if (typeof value.length === "number") return value.length;
  return 0;
}

const isImage =
  contentType.startsWith("image/jpeg") ||
  contentType.startsWith("image/png") ||
  contentType.startsWith("image/webp");

const size = getLength(body);

if (!isImage || !body || size === 0) {
  $done({});
} else {
  console.log(
    `[BluedImage] captured type=${contentType}, size=${size}, url=${$request.url}`
  );

  $httpClient.post(
    {
      url: UPLOAD_URL,
      headers: {
        "Content-Type": contentType.split(";")[0] || "application/octet-stream",
        "X-Blued-Source-URL": $request.url,
        "X-Blued-Image-Size": String(size)
      },
      body: body
    },
    function (error, response, data) {
      if (error) {
        console.log(`[BluedImage] upload failed: ${error}`);
      } else {
        const status =
          (response && (response.status || response.statusCode)) || "unknown";
        console.log(
          `[BluedImage] upload finished status=${status}, response=${data || ""}`
        );
      }

      // Never alter Blued's original image response.
      $done({});
    }
  );
}
