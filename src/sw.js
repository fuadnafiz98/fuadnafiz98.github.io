"use strict";

const version = 4;
let isOnline = true;
let cacheName = `fuadnafiz98-${version}`;

let urlsToCache = [
  "/",
  "/index.html",
  "/pages/home.html",
  "/css/index.css",
  "/js/index.js",
  "/assets/favicon/favicon.ico",
  "/assets/svg/offline.svg",
  "/assets/svg/arrow-narrow-right.svg",
  "/assets/github.svg",
  "/assets/linkedin.svg",
  "/assets/stackoverflow.svg",
  "/assets/twitter.svg",
  "/assets/profile.jpg",
  "/assets/profile.webp",
  "/assets/code.png",
  "assets/code-02.png",
];

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("fetch", onFetch);
self.addEventListener("message", onMessage);

main().catch(console.error);

/***********************/

async function main() {
  await sendMessage({ requestStatusUpdate: true });
  await cacheFiles();
}
async function sendMessage(msg) {
  let allClients = await clients.matchAll({ includeUncontrolled: true });
  return Promise.all(
    allClients.map(function (client) {
      var channel = new MessageChannel();
      channel.port1.onmessage = onMessage;
      return client.postMessage(msg, [channel.port2]);
    })
  );
}
function onMessage({ data }) {
  if (data.statusUpdate) {
    ({ isOnline } = data.statusUpdate);
    console.log(
      `[service worker] (${version}) status update, isOnline: ${isOnline}`
    );
  }
}
async function onInstall(event) {
  console.log(`[service worker] service worker version-${version} installed`);
  self.skipWaiting();
}

async function onActivate(event) {
  event.waitUntil(handleActivation());
}
async function handleActivation() {
  await clearCaches();
  await cacheFiles(/* forceReload */ true);
  await clients.claim();
  console.log(`[service worker] service worker version-${version} activated`);
}

async function cacheFiles(forceReload = false) {
  let cache = await caches.open(cacheName);
  return Promise.all(
    urlsToCache.map(async function (url) {
      try {
        let response;
        if (!forceReload) {
          response = await cache.match(url);
          if (response) {
            return response;
          }
        }
        let options = {
          method: "GET",
          cache: "no-cache", // please fetch fresh result from server, not from browser cache
          credentials: "omit",
        };
        response = await fetch(url, options);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (e) {}
    })
  );
}
async function clearCaches() {
  let cacheNames = await caches.keys();
  let oldCaches = cacheNames.filter(function (cache) {
    if (/^fuadnafiz98-\d+$/.test(cache)) {
      let [, cacheVersion] = cache.match(/^fuadnafiz98-(\d+)$/);
      cacheVersion = cacheVersion != null ? Number(cacheVersion) : cacheVersion;
      return cacheVersion > 0 && cacheVersion != version;
    }
  });
  return Promise.all(
    oldCaches.map(function (cache) {
      return caches.delete(cache);
    })
  );
}

function onFetch(event) {
  event.respondWith(router(event.request));
}
async function router(request) {
  let url = new URL(request.url);
  let requestURL = url.pathname;
  let cache = await caches.open(cacheName);
  if (url.origin == location.origin) {
    try {
      let fetchOptions = {
        method: request.method,
        headers: req.headers,
        credentials: "omit",
        cache: "no-store",
      };
      let res = await fetch(req.url, fetchOptions);
      if (res && res.ok) {
        await cache.put(requestURL, res.clone());
        return res;
      }
    } catch (err) {}
    let response = await cache.match(requestURL);
    if (response) {
      return response.clone();
    }
  }
}
