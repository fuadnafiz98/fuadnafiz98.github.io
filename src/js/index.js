(function main() {
  "use strict";
  let isOnline = "onLine" in navigator ? navigator.onLine : true;
  let usingSW = "serviceWorker" in navigator;
  let swRegistration;
  let sw;
  document.addEventListener("DOMContentLoaded", render, false);
  initServiceWorker().catch(console.error);

  //======= ALL FUNCTIONS ========
  function render() {
    let offlineIcon = document.getElementById("connection-icon");
    let offlineToast = document.getElementById("offline-toast");

    if (!isOnline) {
      offlineIcon.classList.remove("hidden");
      offlineToast.classList.remove("hidden");
    }
    window.addEventListener("online", function online() {
      offlineToast.classList.add("hidden");
      offlineIcon.classList.add("hidden");
      isOnline = true;
      sendStatusUpdate();
    });

    window.addEventListener("offline", function offline() {
      offlineToast.classList.remove("hidden");
      offlineIcon.classList.remove("hidden");
      isOnline = false;
      sendStatusUpdate();
    });
  }

  async function initServiceWorker() {
    swRegistration = await navigator.serviceWorker.register("sw.js", {
      updateViaCache: "none",
    });
    sw =
      swRegistration.installing ||
      swRegistration.waiting ||
      swRegistration.active;
    sendStatusUpdate(sw);

    navigator.serviceWorker.addEventListener("controllerchange", function () {
      sw = navigator.serviceWorker.controller;
      sendStatusUpdate(sw);
    });
    navigator.serviceWorker.addEventListener("message", onSWMessage);
  }

  function onSWMessage(event) {
    let { data } = event;
    if (data.requestStatusUpdate) {
      console.log(`[client] getting update from service worker`);
      sendStatusUpdate(event.ports && event.ports[0]);
    }
  }

  function sendStatusUpdate(target) {
    sendSWMessage({ statusUpdate: { isOnline } }, target);
  }

  async function sendSWMessage(msg, target) {
    if (target) {
      target.postMessage(msg);
    } else if (sw) {
      sw.postMessage(msg);
    } else {
      navigator.serviceWorker.controller.postMessage(msg);
    }
  }
})();
