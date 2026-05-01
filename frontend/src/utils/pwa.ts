/**
 * PWA Utilities
 * Service worker registration and PWA features
 */

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

/**
 * Register service worker for PWA
 */
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registered successfully:', registration.scope);

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, prompt user to refresh
              if (confirm('New version available! Refresh to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }
}

/**
 * Unregister service worker (for development/testing)
 */
export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('Service Worker unregistered');
  }
}

// ============================================
// INSTALL PROMPT
// ============================================

let deferredPrompt: any;

/**
 * Setup PWA install prompt
 */
export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default mini-infobar
    e.preventDefault();
    deferredPrompt = e;

    // Show custom install button
    const installButton = document.getElementById('pwa-install-btn');
    if (installButton) {
      installButton.style.display = 'block';
    }
  });

  // Track installation
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    deferredPrompt = null;
  });
}

/**
 * Show install prompt
 */
export async function showInstallPrompt() {
  if (!deferredPrompt) {
    console.log('No install prompt available');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);
  deferredPrompt = null;
  
  return outcome === 'accepted';
}

/**
 * Check if app is installed
 */
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

// ============================================
// OFFLINE DETECTION
// ============================================

/**
 * Setup offline/online event listeners
 */
export function setupOfflineDetection(
  onOffline?: () => void,
  onOnline?: () => void
) {
  window.addEventListener('offline', () => {
    console.log('📴 App is offline');
    onOffline?.();
  });

  window.addEventListener('online', () => {
    console.log('📶 App is back online');
    onOnline?.();
  });
}

/**
 * Check if currently online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

// ============================================
// BACKGROUND SYNC
// ============================================

/**
 * Register background sync
 */
export async function registerBackgroundSync(tag: string) {
  if ('serviceWorker' in navigator && 'sync' in (self as any).registration) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register(tag);
      console.log(`Background sync registered: ${tag}`);
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }

  return Notification.permission;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      // pushManager.subscribe expects a BufferSource (ArrayBuffer or ArrayBufferView).
      // Convert the Uint8Array to its underlying ArrayBuffer to satisfy the types
      // and runtime expectations.
      applicationServerKey: (urlBase64ToUint8Array(
        // Replace with your VAPID public key
        'YOUR_VAPID_PUBLIC_KEY_HERE'
      ).buffer as ArrayBuffer),
    });

    console.log('Push notification subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
}

/**
 * Show local notification
 */
export async function showNotification(
  title: string,
  options?: NotificationOptions
) {
  const permission = await requestNotificationPermission();
  
  if (permission === 'granted') {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options,
      });
    } else {
      new Notification(title, options);
    }
  }
}

// Helper function
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
  .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ============================================
// CACHE MANAGEMENT
// ============================================

/**
 * Clear all caches (for development)
 */
export async function clearAllCaches() {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((name) => caches.delete(name))
    );
    console.log('All caches cleared');
  }
}

/**
 * Get cache size
 */
export async function getCacheSize(): Promise<number> {
  if ('caches' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return estimate.usage || 0;
  }
  return 0;
}
