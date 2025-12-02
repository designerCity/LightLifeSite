// LIGHT PWA Service Worker
const CACHE_NAME = 'light-pwa-v1.0.0';

// 현재 위치를 기준으로 캐시할 URL 목록
// Service Worker의 위치를 기준으로 상대 경로 사용
const getBaseUrl = () => {
  // Service Worker 파일의 디렉토리를 base URL로 사용
  const swUrl = new URL(self.location.href);
  const basePath = swUrl.pathname.substring(0, swUrl.pathname.lastIndexOf('/') + 1);
  return swUrl.origin + basePath;
};

const baseUrl = getBaseUrl();
const urlsToCache = [
  baseUrl,
  baseUrl + 'index.html',
  baseUrl + 'styles.css',
  baseUrl + 'script.js',
  baseUrl + 'manifest.json',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - 캐시 생성
self.addEventListener('install', (event) => {
  console.log('LIGHT PWA Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('LIGHT PWA Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('LIGHT PWA Cache populated');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('LIGHT PWA Cache installation failed:', error);
      })
  );
});

// Activate event - 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('LIGHT PWA Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('LIGHT PWA Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('LIGHT PWA Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - 네트워크 우선, 캐시 폴백
self.addEventListener('fetch', (event) => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') {
    return;
  }
  
  // 외부 리소스는 네트워크 우선
  if (event.request.url.includes('fonts.googleapis.com') || 
      event.request.url.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 성공 시 캐시에 저장
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // 네트워크 실패 시 캐시에서 반환
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // 앱 리소스는 캐시 우선
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 반환
        if (response) {
          return response;
        }
        
        // 캐시에 없으면 네트워크에서 가져오기
        return fetch(event.request)
          .then((response) => {
            // 유효한 응답인지 확인
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 응답을 캐시에 저장
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // 네트워크 실패 시 오프라인 페이지 반환
            if (event.request.destination === 'document') {
              // 현재 위치를 기준으로 index.html 찾기
              const baseUrl = new URL(event.request.url).origin + new URL(event.request.url).pathname.replace(/\/[^/]*$/, '/');
              return caches.match(baseUrl + 'index.html').catch(() => {
                // 캐시에서 찾지 못하면 루트 index.html 시도
                return caches.match(new URL('./index.html', event.request.url).href);
              });
            }
          });
      })
  );
});

// Background Sync (오프라인 지원)
self.addEventListener('sync', (event) => {
  console.log('LIGHT PWA Background sync:', event.tag);
  
  if (event.tag === 'light-sync') {
    event.waitUntil(
      // 오프라인에서 저장된 데이터 동기화
      syncOfflineData()
    );
  }
});

// 오프라인 데이터 동기화 함수
async function syncOfflineData() {
  try {
    // IndexedDB에서 오프라인 데이터 가져오기
    const offlineData = await getOfflineData();
    
    if (offlineData && offlineData.length > 0) {
      // 서버에 데이터 전송
      for (const data of offlineData) {
        try {
          await fetch('/api/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          });
          
          // 성공 시 오프라인 데이터 삭제
          await removeOfflineData(data.id);
        } catch (error) {
          console.error('LIGHT PWA Sync failed:', error);
        }
      }
    }
  } catch (error) {
    console.error('LIGHT PWA Background sync error:', error);
  }
}

// Push 알림 처리
self.addEventListener('push', (event) => {
  console.log('LIGHT PWA Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'LIGHT에서 새로운 소식이 있습니다.',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🕯️</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🕯️</text></svg>',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '앱 열기',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📱</text></svg>'
      },
      {
        action: 'close',
        title: '닫기',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">❌</text></svg>'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('LIGHT', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('LIGHT PWA Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // 앱 열기
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// IndexedDB 헬퍼 함수들
async function getOfflineData() {
  return new Promise((resolve) => {
    const request = indexedDB.open('LIGHT_OFFLINE', 1);
    
    request.onerror = () => resolve([]);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => resolve([]);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('offlineData')) {
        db.createObjectStore('offlineData', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function removeOfflineData(id) {
  return new Promise((resolve) => {
    const request = indexedDB.open('LIGHT_OFFLINE', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      store.delete(id);
      resolve();
    };
    
    request.onerror = () => resolve();
  });
}

console.log('LIGHT PWA Service Worker loaded successfully! 🌱');
