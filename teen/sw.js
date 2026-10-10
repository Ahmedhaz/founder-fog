// Teenpreneur service worker: caches the whole game so it works offline.
// Everything is same-origin: fonts and pictures are bundled.
const CACHE = 'teen-v1';
const ASSETS = [
  './',
  './index.html',
  './game.js',
  './content.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './fonts/Manrope.ttf',
  './fonts/ReadexPro.ttf',
  './img/artist_palette.webp',
  './img/balance_scale.webp',
  './img/battery.webp',
  './img/birthday_cake.webp',
  './img/books.webp',
  './img/boy.webp',
  './img/brain.webp',
  './img/briefcase.webp',
  './img/bullseye.webp',
  './img/busts_in_silhouette.webp',
  './img/calendar.webp',
  './img/chart_decreasing.webp',
  './img/chart_increasing.webp',
  './img/check_mark_button.webp',
  './img/child.webp',
  './img/classical.webp',
  './img/cloud.webp',
  './img/cloud_with_rain.webp',
  './img/coin.webp',
  './img/cookie.webp',
  './img/cooking.webp',
  './img/counterclockwise.webp',
  './img/cupcake.webp',
  './img/detective.webp',
  './img/door.webp',
  './img/e-mail.webp',
  './img/exploding_head.webp',
  './img/face_exhaling.webp',
  './img/face_with_spiral_eyes.webp',
  './img/fire.webp',
  './img/framed_picture.webp',
  './img/girl.webp',
  './img/glowing_star.webp',
  './img/graduation_cap.webp',
  './img/grimacing_face.webp',
  './img/hammer_and_wrench.webp',
  './img/handshake.webp',
  './img/heart_hands.webp',
  './img/high_voltage.webp',
  './img/hourglass_not_done.webp',
  './img/house.webp',
  './img/incoming_envelope.webp',
  './img/label.webp',
  './img/laptop.webp',
  './img/light_bulb.webp',
  './img/locked.webp',
  './img/magnifying_glass_tilted_left.webp',
  './img/man.webp',
  './img/man_technologist.webp',
  './img/memo.webp',
  './img/mobile_phone.webp',
  './img/money_bag.webp',
  './img/money_with_wings.webp',
  './img/newspaper.webp',
  './img/notebook.webp',
  './img/old_man.webp',
  './img/old_woman.webp',
  './img/package.webp',
  './img/party_popper.webp',
  './img/partying_face.webp',
  './img/person_in_lotus_position.webp',
  './img/person_running.webp',
  './img/pig_face.webp',
  './img/placard.webp',
  './img/police_car_light.webp',
  './img/puzzle_piece.webp',
  './img/receipt.webp',
  './img/red_heart.webp',
  './img/ribbon.webp',
  './img/robot.webp',
  './img/rocket.webp',
  './img/satellite_antenna.webp',
  './img/scissors.webp',
  './img/seedling.webp',
  './img/shield.webp',
  './img/shopping_bags.webp',
  './img/shopping_cart.webp',
  './img/smiling_face_with_smiling_eyes.webp',
  './img/smiling_face_with_sunglasses.webp',
  './img/soft_ice_cream.webp',
  './img/sparkles.webp',
  './img/speech_balloon.webp',
  './img/star-struck.webp',
  './img/star.webp',
  './img/sun.webp',
  './img/sunrise.webp',
  './img/thinking_face.webp',
  './img/trophy.webp',
  './img/unlocked.webp',
  './img/video_game.webp',
  './img/warning.webp',
  './img/woman.webp',
  './img/woman_office_worker.webp',
  './img/woman_technologist.webp',
  './img/woozy_face.webp',
  './img/wrapped_gift.webp',
  './img/wrench.webp',
  './img/yawning_face.webp',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('teen-') && k !== CACHE).map((k) => caches.delete(k))))
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
