// Business Owner service worker: caches the whole game so it works offline.
// Everything is same-origin: fonts and pictures are bundled. When a picture is added to img/,
// add it here too (owner/tests/play.mjs checks that every file in img/ is listed).
const CACHE = 'owner-v1';
const ASSETS = [
  './',
  './index.html',
  './game.js',
  './content.js',
  './playbook.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './fonts/Manrope.ttf',
  './fonts/ReadexPro.ttf',
  './img/balance_scale.webp',
  './img/bar_chart.webp',
  './img/battery.webp',
  './img/boy.webp',
  './img/briefcase.webp',
  './img/busts_in_silhouette.webp',
  './img/calendar.webp',
  './img/chart_decreasing.webp',
  './img/check_mark_button.webp',
  './img/child.webp',
  './img/classical_building.webp',
  './img/cloud.webp',
  './img/coin.webp',
  './img/crossed_swords.webp',
  './img/detective.webp',
  './img/dollar_banknote.webp',
  './img/door.webp',
  './img/face_exhaling.webp',
  './img/face_with_spiral_eyes.webp',
  './img/girl.webp',
  './img/glowing_star.webp',
  './img/graduation_cap.webp',
  './img/grimacing_face.webp',
  './img/hammer_and_wrench.webp',
  './img/handshake.webp',
  './img/high_voltage.webp',
  './img/hourglass_not_done.webp',
  './img/house.webp',
  './img/label.webp',
  './img/light_bulb.webp',
  './img/locked.webp',
  './img/man.webp',
  './img/man_office_worker.webp',
  './img/man_technologist.webp',
  './img/memo.webp',
  './img/mobile_phone.webp',
  './img/money_bag.webp',
  './img/money_with_wings.webp',
  './img/necktie.webp',
  './img/newspaper.webp',
  './img/notebook.webp',
  './img/office_building.webp',
  './img/old_man.webp',
  './img/old_woman.webp',
  './img/package.webp',
  './img/party_popper.webp',
  './img/person_in_lotus_position.webp',
  './img/person_running.webp',
  './img/pig_face.webp',
  './img/placard.webp',
  './img/police_car_light.webp',
  './img/puzzle_piece.webp',
  './img/receipt.webp',
  './img/red_heart.webp',
  './img/seedling.webp',
  './img/shield.webp',
  './img/shopping_cart.webp',
  './img/sparkles.webp',
  './img/speech_balloon.webp',
  './img/star-struck.webp',
  './img/star.webp',
  './img/stethoscope.webp',
  './img/sun.webp',
  './img/sunrise.webp',
  './img/test_tube.webp',
  './img/trophy.webp',
  './img/unlocked.webp',
  './img/woman.webp',
  './img/woman_office_worker.webp',
  './img/yawning_face.webp',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('owner-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first for the game files (so updates arrive), cache first for fonts and pictures.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/img/') || url.pathname.includes('/fonts/')) {
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
