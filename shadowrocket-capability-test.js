/*
 * Shadowrocket iOS capability probe
 * Tests API exposure only; does not modify intercepted traffic.
 */

function typeOf(name, value) {
  let ctor = "";
  try {
    ctor = value && value.constructor && value.constructor.name
      ? value.constructor.name
      : "";
  } catch (_) {}
  console.log("[SR-CAP] " + name + ": typeof=" + typeof value + (ctor ? ", ctor=" + ctor : ""));
}

console.log("[SR-CAP] ===== capability test start =====");

// 1) File-related/global APIs
const candidates = [
  ["$persistentStore", typeof $persistentStore !== "undefined" ? $persistentStore : undefined],
  ["$notification", typeof $notification !== "undefined" ? $notification : undefined],
  ["$httpClient", typeof $httpClient !== "undefined" ? $httpClient : undefined],
  ["$httpAPI", typeof $httpAPI !== "undefined" ? $httpAPI : undefined],
  ["$file", typeof $file !== "undefined" ? $file : undefined],
  ["$files", typeof $files !== "undefined" ? $files : undefined],
  ["$filesystem", typeof $filesystem !== "undefined" ? $filesystem : undefined],
  ["File", typeof File !== "undefined" ? File : undefined],
  ["FileReader", typeof FileReader !== "undefined" ? FileReader : undefined],
  ["Blob", typeof Blob !== "undefined" ? Blob : undefined],
  ["navigator.share", typeof navigator !== "undefined" ? navigator.share : undefined],
];

candidates.forEach(function (x) {
  typeOf(x[0], x[1]);
});

// Persistent store is not a real file API, but verify read/write works.
try {
  if (typeof $persistentStore !== "undefined") {
    const ok = $persistentStore.write("sr-capability-test", "sr_capability_test");
    const value = $persistentStore.read("sr_capability_test");
    console.log("[SR-CAP] persistentStore write=" + ok + ", read=" + value);
  }
} catch (e) {
  console.log("[SR-CAP] persistentStore ERROR: " + e);
}

// 2) Share Sheet candidates
let shareSupported = false;
try {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    shareSupported = true;
    console.log("[SR-CAP] navigator.share EXISTS");
  }
} catch (e) {
  console.log("[SR-CAP] navigator.share ERROR: " + e);
}
console.log("[SR-CAP] share-sheet-api=" + (shareSupported ? "candidate" : "not exposed"));

// 3) URL Scheme via notification openUrl.
// This creates a notification. Tapping it should open Shortcuts.
// We deliberately do not auto-launch another app from background interception.
try {
  if (
    typeof $notification !== "undefined" &&
    typeof $notification.post === "function"
  ) {
    $notification.post(
      "Shadowrocket 能力测试",
      "URL Scheme",
      "点击这条通知：如果能打开快捷指令 App，则 openUrl 可用。",
      { openUrl: "shortcuts://" }
    );
    console.log("[SR-CAP] notification openUrl POSTED: shortcuts://");
  } else {
    console.log("[SR-CAP] notification.post NOT AVAILABLE");
  }
} catch (e) {
  console.log("[SR-CAP] notification openUrl ERROR: " + e);
}

console.log("[SR-CAP] ===== capability test end =====");
$done({});
