/* MHF: نسخه‌ی آفلاین برنامه. اگر index.html را عوض کردی، عدد نسخه را زیاد کن. */
var CACHE='mhf-v1';
var FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var isPage=e.request.mode==='navigate';
  if(isPage){
    /* صفحه: اگر اینترنت بود نسخه‌ی تازه، وگرنه نسخه‌ی ذخیره‌شده */
    e.respondWith(fetch(e.request).then(function(r){
      var copy=r.clone();caches.open(CACHE).then(function(c){c.put('./index.html',copy);});
      return r;
    }).catch(function(){return caches.match('./index.html');}));
  }else{
    e.respondWith(caches.match(e.request).then(function(hit){return hit||fetch(e.request);}));
  }
});
