// The Little Entrepreneur service worker: caches the game so it works offline.
// The only cross-origin requests are the Google Font files, cached on first use.
const CACHE = 'little-v1';
const ASSETS = ['./', './index.html', './game.js', './content.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './img/artist_palette.webp', './img/bell.webp', './img/bicycle.webp', './img/birthday_cake.webp', './img/books.webp', './img/boy.webp', './img/bubbles.webp', './img/cat_face.webp', './img/child.webp', './img/cloud_with_rain.webp', './img/coin.webp', './img/cookie.webp', './img/cooking.webp', './img/crayon.webp', './img/cup_with_straw.webp', './img/cupcake.webp', './img/framed_picture.webp', './img/girl.webp', './img/glowing_star.webp', './img/grimacing_face.webp', './img/grinning_face_with_big_eyes.webp', './img/handshake.webp', './img/heart_hands.webp', './img/high_voltage.webp', './img/hot_face.webp', './img/hourglass_not_done.webp', './img/house.webp', './img/ice.webp', './img/lemon.webp', './img/light_bulb.webp', './img/locked.webp', './img/man.webp', './img/money_bag.webp', './img/old_man.webp', './img/old_woman.webp', './img/package.webp', './img/partying_face.webp', './img/peanuts.webp', './img/pig_face.webp', './img/placard.webp', './img/rainbow.webp', './img/ribbon.webp', './img/scissors.webp', './img/shopping_cart.webp', './img/sleeping_face.webp', './img/smiling_face_with_smiling_eyes.webp', './img/soap.webp', './img/soccer_ball.webp', './img/soft_ice_cream.webp', './img/sparkles.webp', './img/speech_balloon.webp', './img/sun.webp', './img/teddy_bear.webp', './img/thinking_face.webp', './img/thumbs_up.webp', './img/unlocked.webp', './img/video_game.webp', './img/woman.webp', './img/wrapped_gift.webp', './img/wrench.webp', './img/yawning_face.webp'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('little-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first for the game files (so updates arrive), cache first for fonts and images.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== self.location.origin && !isFont) return;
  if (isFont || url.pathname.includes('/img/')) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
      return res;
    })));
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('./index.html')))
  );
});
