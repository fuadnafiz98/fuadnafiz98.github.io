"use strict";

const version = 2;
let isOnline = true;

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("message", onMessage);

main().catch(console.error);

/***********************/

async function main() {
  await sendMessage({ requestStatusUpdate: true });
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
  await clients.claim();
  console.log(`[service worker] service worker version-${version} activated`);
}
