import JSZip from 'jszip';
import { AppIdentityConfig, DeliveryTarget, TenantStore } from '../types';

/**
 * Generates capacitor.config.json content for Android / iOS targets
 */
export function generateCapacitorConfig(tenant: TenantStore, identity: AppIdentityConfig): string {
  const config = {
    appId: identity.packageName || `sa.${tenant.slug}.app`,
    appName: identity.appName || tenant.name,
    webDir: 'dist',
    bundledWebRuntime: false,
    server: {
      url: `https://${tenant.domain}`,
      cleartext: true,
      androidScheme: 'https'
    },
    plugins: {
      SplashScreen: {
        launchShowDuration: 2000,
        launchAutoHide: true,
        backgroundColor: identity.splashBackgroundColor || '#0F172A',
        androidSplashResourceName: 'splash',
        androidScaleType: 'CENTER_CROP',
        showSpinner: false
      },
      PushNotifications: {
        presentationOptions: ['badge', 'sound', 'alert']
      },
      StatusBar: {
        style: 'DARK',
        backgroundColor: identity.primaryColor || tenant.theme.tokens.primary
      },
      Keyboard: {
        resize: 'body',
        style: 'dark',
        resizeOnFullScreen: true
      }
    }
  };

  return JSON.stringify(config, null, 2);
}

/**
 * Generates Android root and app build.gradle files
 */
export function generateAndroidGradle(tenant: TenantStore, identity: AppIdentityConfig): string {
  return `apply plugin: 'com.android.application'

android {
    namespace "${identity.packageName || `sa.${tenant.slug}.app`}"
    compileSdkVersion 34
    defaultConfig {
        applicationId "${identity.packageName || `sa.${tenant.slug}.app`}"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode ${identity.buildNumber || 18}
        versionName "${identity.version || '1.4.0'}"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        aaptOptions {
             // Files and dirs to omit from the packaged assets inside the APK.
             ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~'
        }
    }
    signingConfigs {
        release {
            storeFile file("release.keystore")
            storePassword System.getenv("KEYSTORE_PASSWORD") ?: "SecureStorePass2026!"
            keyAlias System.getenv("KEY_ALIAS") ?: "release-key"
            keyPassword System.getenv("KEY_PASSWORD") ?: "SecureStorePass2026!"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

repositories {
    flatDir{
        dirs '../capacitor-cordova-android-plugins/src/main/libs', 'libs'
    }
}

dependencies {
    implementation fileTree(include: ['*.jar'], dir: 'libs')
    implementation "androidx.appcompat:appcompat:1.6.1"
    implementation "androidx.coordinatorlayout:coordinatorlayout:1.2.0"
    implementation "androidx.core:core-splashscreen:1.0.1"
    implementation project(':capacitor-android')
    implementation project(':capacitor-cordova-android-plugins')
}

apply from: 'capacitor.build.gradle'
`;
}

/**
 * Generates MainActivity.java for Capacitor Android
 */
export function generateMainActivityJava(tenant: TenantStore, identity: AppIdentityConfig): string {
  const pkg = identity.packageName || `sa.${tenant.slug}.app`;
  return `package ${pkg};

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // CommerceOS Native Bridge Initialization
    }
}
`;
}

/**
 * Generates Android strings.xml
 */
export function generateAndroidStrings(tenant: TenantStore, identity: AppIdentityConfig): string {
  return `<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">${identity.appName || tenant.name}</string>
    <string name="title_activity_main">${identity.appName || tenant.name}</string>
    <string name="package_name">${identity.packageName || `sa.${tenant.slug}.app`}</string>
    <string name="custom_url_scheme">${tenant.slug}</string>
</resources>
`;
}

/**
 * Generates AndroidManifest.xml template
 */
export function generateAndroidManifest(tenant: TenantStore, identity: AppIdentityConfig): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${identity.packageName || `sa.${tenant.slug}.app`}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    ${identity.enableCameraPermission ? '<uses-permission android:name="android.permission.CAMERA" />' : ''}
    ${identity.enableBiometrics ? '<uses-permission android:name="android.permission.USE_BIOMETRIC" />\n    <uses-permission android:name="android.permission.USE_FINGERPRINT" />' : ''}
    ${identity.enablePush ? '<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n    <uses-permission android:name="android.permission.VIBRATE" />' : ''}

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${identity.appName || tenant.name}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="${identity.appName || tenant.name}"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Deep linking & App Links -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" android:host="${tenant.domain}" />
                <data android:scheme="${tenant.slug}" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
}

/**
 * Generates iOS Podfile
 */
export function generateIOSPodfile(tenant: TenantStore): string {
  return `platform :ios, '15.0'
use_frameworks!

# workaround to avoid Xcode caching of Pods that requires
# Product -> Clean Build Folder after new Cordova plugins installed
install! 'cocoapods', :disable_input_output_paths => true

def capacitor_pods
  pod 'Capacitor', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorCordova', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorApp', :path => '../../node_modules/@capacitor/app'
  pod 'CapacitorPushNotifications', :path => '../../node_modules/@capacitor/push-notifications'
  pod 'CapacitorSplashScreen', :path => '../../node_modules/@capacitor/splash-screen'
end

target 'App' do
  capacitor_pods
end
`;
}

/**
 * Generates iOS AppDelegate.swift
 */
export function generateIOSAppDelegate(tenant: TenantStore): string {
  return `import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
`;
}

/**
 * Generates iOS Info.plist template
 */
export function generateIOSInfoPlist(tenant: TenantStore, identity: AppIdentityConfig): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>ar</string>
    <key>CFBundleDisplayName</key>
    <string>${identity.appName || tenant.name}</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>${identity.bundleId || `sa.${tenant.slug}.store`}</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>${identity.version || '1.4.0'}</string>
    <key>CFBundleVersion</key>
    <string>${identity.buildNumber || '18'}</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIMainStoryboardFile</key>
    <string>Main</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
    </array>
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleURLName</key>
            <string>${identity.bundleId || `sa.${tenant.slug}.store`}</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>${tenant.slug}</string>
            </array>
        </dict>
    </array>
    ${identity.enableCameraPermission ? '<key>NSCameraUsageDescription</key>\n    <string>تطبيق المتجر يحتاج الكاميرا لمسح باركود المنتجات وقراءة بطاقات الدفع</string>' : ''}
    ${identity.enableBiometrics ? '<key>NSFaceIDUsageDescription</key>\n    <string>استخدام البصمة أو FaceID لتسجيل الدخول السريع وتأكيد الدفع</string>' : ''}
</dict>
</plist>`;
}

/**
 * Generates package.json for Capacitor project
 */
export function generateCapacitorPackageJson(tenant: TenantStore, identity: AppIdentityConfig): string {
  const pkg = {
    name: `${tenant.slug}-mobile-app`,
    version: identity.version || '1.4.0',
    private: true,
    scripts: {
      "cap:sync": "cap sync",
      "cap:android": "cap open android",
      "cap:ios": "cap open ios",
      "build:android": "cd android && ./gradlew assembleRelease",
      "build:aab": "cd android && ./gradlew bundleRelease"
    },
    dependencies: {
      "@capacitor/app": "^6.0.0",
      "@capacitor/cli": "^6.0.0",
      "@capacitor/core": "^6.0.0",
      "@capacitor/android": "^6.0.0",
      "@capacitor/ios": "^6.0.0",
      "@capacitor/splash-screen": "^6.0.0",
      "@capacitor/push-notifications": "^6.0.0",
      "@capacitor/status-bar": "^6.0.0",
      "@capacitor/camera": "^6.0.0"
    }
  };
  return JSON.stringify(pkg, null, 2);
}

/**
 * Generates PWA manifest.json
 */
export function generatePWAManifest(tenant: TenantStore, identity: AppIdentityConfig): string {
  const manifest = {
    name: identity.appName || tenant.name,
    short_name: identity.shortName || tenant.pwaConfig?.shortName || tenant.name.split(' ')[0],
    description: tenant.description || `${tenant.name} - متجر تجارة إلكترونية سحابي`,
    start_url: `/?store=${tenant.slug}&utm_source=pwa`,
    scope: '/',
    display: 'standalone',
    background_color: identity.splashBackgroundColor || tenant.pwaConfig?.backgroundColor || '#0F172A',
    theme_color: identity.primaryColor || tenant.theme.tokens.primary,
    orientation: 'portrait-primary',
    dir: 'rtl',
    lang: 'ar',
    categories: ['shopping', 'business'],
    icons: [
      {
        src: tenant.logo || '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: tenant.logo || '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    shortcuts: [
      {
        name: 'العروض والتخفيضات',
        short_name: 'العروض',
        description: 'تصفح أحدث الخصومات والكوبونات',
        url: '/#offers',
        icons: [{ src: tenant.logo, sizes: '96x96' }]
      },
      {
        name: 'سلة التسوق',
        short_name: 'السلة',
        description: 'إتمام الشراء والدفع السريع',
        url: '/#cart',
        icons: [{ src: tenant.logo, sizes: '96x96' }]
      }
    ]
  };

  return JSON.stringify(manifest, null, 2);
}

/**
 * Generates Service Worker (sw.js) for PWA offline caching
 */
export function generateServiceWorker(tenant: TenantStore): string {
  return `// CommerceOS Sovereign Service Worker for ${tenant.slug}
const CACHE_NAME = 'commerceos-${tenant.slug}-v2.0';
const OFFLINE_FALLBACK = '/offline.html';

const CRITICAL_STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/pwa-installer.js',
  '${tenant.logo}'
];

// Install: Cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching critical assets for offline support');
      return cache.addAll(CRITICAL_STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging old cache version:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Stale-While-Revalidate for static & Network-First for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html') || caches.match(OFFLINE_FALLBACK))
    );
    return;
  }

  // API Requests: Network with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok && request.method === 'GET') {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static Assets: Cache-First with background revalidation
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Trigger background fetch to refresh cache
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
        }
        return networkResponse;
      });
    })
  );
});

// Background Push Notification handling
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: '${tenant.name}', body: 'تحديث جديد لطلبك!' };
  const options = {
    body: data.body,
    icon: '${tenant.logo}',
    badge: '${tenant.logo}',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
`;
}

/**
 * Generates offline.html for PWA fallback
 */
export function generateOfflineHtml(tenant: TenantStore): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>وضع عدم الاتصال | ${tenant.name}</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #090D16;
            color: #F8FAFC;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .card {
            background: #131B2E;
            border: 1px solid #1E293B;
            border-radius: 20px;
            padding: 40px 24px;
            max-width: 420px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .icon { font-size: 48px; margin-bottom: 16px; }
        h1 { font-size: 20px; margin-bottom: 8px; color: #F59E0B; }
        p { font-size: 14px; color: #94A3B8; line-height: 1.6; margin-bottom: 24px; }
        button {
            background: #D4A017;
            color: #0F172A;
            border: none;
            font-weight: bold;
            padding: 12px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            transition: transform 0.2s;
        }
        button:active { transform: scale(0.96); }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">📶</div>
        <h1>لا يوجد اتصال بالإنترنت</h1>
        <p>يبدو أنك غير متصل بالشبكة حالياً. يمكنك تصفح المنتجات المحفوظة في ذاكرة التخزين المؤقت، أو إعادة المحاولة عند عودة الاتصال.</p>
        <button onclick="window.location.reload()">إعادة المحاولة الآن</button>
    </div>
</body>
</html>
`;
}

/**
 * Generates standalone PWA index.html
 */
export function generatePWAIndexHtml(tenant: TenantStore, identity: AppIdentityConfig): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>${identity.appName || tenant.name} - متجر إلكتروني رسمي</title>
    
    <!-- PWA & Mobile Web Meta Tags -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="${identity.primaryColor || tenant.theme.tokens.primary}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="${identity.shortName || tenant.name}">
    <link rel="apple-touch-icon" href="${tenant.logo}">

    <!-- Open Graph & Social -->
    <meta property="og:title" content="${identity.appName || tenant.name}">
    <meta property="og:description" content="${tenant.description || 'متجر إلكتروني متكامل'}">
    <meta property="og:image" content="${tenant.logo}">
    <meta property="og:type" content="website">

    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: #090D16;
            color: #F8FAFC;
            font-family: system-ui, -apple-system, sans-serif;
            overflow-x: hidden;
        }
        #app-root { min-height: 100vh; display: flex; flex-direction: column; }
    </style>
</head>
<body>
    <div id="app-root">
        <!-- CommerceOS Web Store Runtime -->
        <iframe 
            src="https://${tenant.domain}/?embed=true" 
            style="width:100%; height:100vh; border:none;"
            allow="payment; camera; geolocation"
        ></iframe>
    </div>

    <!-- Service Worker Registration & A2HS Prompt -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('[CommerceOS] ServiceWorker registered:', reg.scope))
                    .catch(err => console.error('[CommerceOS] ServiceWorker error:', err));
            });
        }
    </script>
    
    <!-- CommerceOS Integrity & Watermark Protection Runtime -->
    ${tenant.licensing?.isWhiteLabel && tenant.licensing?.verified ? `<!-- White-Label Certified Build: All telemetry & watermarks omitted -->` : `
    <script>
      (function(){
        try {
          var _c = "${typeof btoa !== 'undefined' ? btoa(unescape(encodeURIComponent('<div id="cos-watermark-guard" data-cos-seal="verified" style="display:flex;align-items:center;justify-content:center;gap:6px;padding:12px;font-size:11px;color:#94a3b8;border-top:1px solid rgba(255,255,255,0.06);background:rgba(15,23,42,0.6);text-align:center;"><span>صُنع وتطوير بواسطة</span><a href="https://commerceos.app" target="_blank" rel="noopener noreferrer" style="color:#f59e0b;font-weight:bold;text-decoration:none;">CommerceOS™</a></div>'))) : ''}";
          var _d = decodeURIComponent(escape(atob(_c)));
          window.addEventListener('DOMContentLoaded', function(){
            var f = document.querySelector('footer') || document.body;
            if (f && !document.getElementById('cos-watermark-guard')) {
              var el = document.createElement('div');
              el.innerHTML = _d;
              f.appendChild(el.firstChild);
            }
          });
        } catch(e){}
      })();
    </script>`}
</body>
</html>
`;
}

/**
 * Generates Docker Compose configuration for Self-Hosted package
 */
export function generateDockerCompose(tenant: TenantStore): string {
  return `version: '3.8'

services:
  commerceos-store:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: commerceos-${tenant.slug}
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=3000
      - TENANT_ID=${tenant.id}
      - TENANT_SLUG=${tenant.slug}
      - STORE_NAME=${tenant.name}
      - DOMAIN=${tenant.domain}
      - JWT_SECRET=sovereign_secret_${tenant.slug}_2026
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    networks:
      - commerceos-net
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx-proxy:
    image: nginx:alpine
    container_name: nginx-${tenant.slug}
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - commerceos-store
    networks:
      - commerceos-net

networks:
  commerceos-net:
    driver: bridge
`;
}

/**
 * Generates Dockerfile for standalone Self-Hosted container
 */
export function generateDockerfile(tenant: TenantStore): string {
  return `# Multi-stage Sovereign Node.js Runtime for ${tenant.slug}
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install dependencies and security packages
RUN apk add --no-cache libc6-compat wget

COPY package.json package-lock.json* ./
RUN npm install --production --frozen-lockfile || npm install --production

COPY . .

# Create volume directories with proper permissions
RUN mkdir -p /app/data /app/uploads && chown -R node:node /app

USER node
EXPOSE 3000

CMD ["node", "server.js"]
`;
}

/**
 * Generates Nginx configuration for Self-Hosted reverse proxy
 */
export function generateNginxConf(tenant: TenantStore): string {
  return `server {
    listen 80;
    server_name ${tenant.customDomain || tenant.domain || 'localhost'};

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/json application/javascript;

    location / {
        proxy_pass http://commerceos-store:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static Assets Caching
    location /assets/ {
        proxy_pass http://commerceos-store:3000/assets/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Uploads & Receipt Images
    location /uploads/ {
        proxy_pass http://commerceos-store:3000/uploads/;
        expires 7d;
        add_header Cache-Control "public";
    }
}
`;
}

/**
 * Generates standalone server.js for Docker deployment
 */
export function generateSelfHostedServerJs(tenant: TenantStore): string {
  return `// Self-Hosted Standalone Microservice for ${tenant.name} (${tenant.slug})
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: 'sovereign_self_hosted',
    tenant: '${tenant.slug}',
    timestamp: new Date().toISOString()
  });
});

// Embedded Store Config Endpoint
app.get('/api/v1/store/config', (req, res) => {
  res.json({
    id: '${tenant.id}',
    slug: '${tenant.slug}',
    name: '${tenant.name}',
    currency: '${tenant.currency || 'SAR'}',
    theme: ${JSON.stringify(tenant.theme || {})},
    paymentGateways: ${JSON.stringify(tenant.paymentGateways || {})}
  });
});

// Serve PWA Static Files
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`[CommerceOS Sovereign] \${'${tenant.name}'} running on http://0.0.0.0:\${PORT}\`);
});
`;
}

/**
 * Generates deploy.sh for one-click VPS deployment
 */
export function generateDeployScript(tenant: TenantStore): string {
  return `#!/bin/bash
# ==========================================================
# CommerceOS Sovereign 1-Click Deployment for ${tenant.name}
# ==========================================================
set -e

echo "🚀 Starting deployment for ${tenant.name} (${tenant.slug})..."

# Check Docker & Docker Compose installation
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose not found. Installing plugin..."
    apt-get update && apt-get install -y docker-compose-plugin
fi

# Build and launch containers
echo "📦 Building and starting containers..."
docker compose down || true
docker compose build --no-cache
docker compose up -d

echo "✅ Deployment completed successfully!"
echo "🌐 Store is live on your configured domain: ${tenant.domain}"
docker compose ps
`;
}

/**
 * Generates a complete downloadable JSZip package for a specific delivery target
 */
export async function exportZipPackage(
  target: 'android' | 'ios' | 'pwa' | 'self_hosted' | 'capacitor_all',
  tenant: TenantStore,
  identity: AppIdentityConfig
): Promise<Blob> {
  const zip = new JSZip();

  if (target === 'android' || target === 'capacitor_all') {
    const androidFolder = zip.folder('android');
    const appFolder = androidFolder?.folder('app');
    const mainFolder = appFolder?.folder('src')?.folder('main');
    
    // Android config & scripts
    zip.file('capacitor.config.json', generateCapacitorConfig(tenant, identity));
    zip.file('package.json', generateCapacitorPackageJson(tenant, identity));
    
    appFolder?.file('build.gradle', generateAndroidGradle(tenant, identity));
    mainFolder?.file('AndroidManifest.xml', generateAndroidManifest(tenant, identity));
    
    const javaPath = (identity.packageName || `sa.${tenant.slug}.app`).replace(/\./g, '/');
    mainFolder?.folder('java')?.folder(javaPath)?.file('MainActivity.java', generateMainActivityJava(tenant, identity));
    
    const resValues = mainFolder?.folder('res')?.folder('values');
    resValues?.file('strings.xml', generateAndroidStrings(tenant, identity));
    
    zip.file('README-ANDROID.md', `# ${tenant.name} - Android Studio Project

## Quick Start
1. Install dependencies:
   \`npm install\`
2. Sync Capacitor bridge:
   \`npx cap sync android\`
3. Open in Android Studio:
   \`npx cap open android\`
4. Build Release APK:
   \`cd android && ./gradlew assembleRelease\`
`);
  }

  if (target === 'ios' || target === 'capacitor_all') {
    const iosFolder = zip.folder('ios');
    const appFolder = iosFolder?.folder('App');
    
    zip.file('capacitor.config.json', generateCapacitorConfig(tenant, identity));
    zip.file('package.json', generateCapacitorPackageJson(tenant, identity));
    
    iosFolder?.file('Podfile', generateIOSPodfile(tenant));
    appFolder?.folder('App')?.file('Info.plist', generateIOSInfoPlist(tenant, identity));
    appFolder?.folder('App')?.file('AppDelegate.swift', generateIOSAppDelegate(tenant));
    
    zip.file('README-IOS.md', `# ${tenant.name} - iOS Xcode Project

## Quick Start
1. Install dependencies:
   \`npm install\`
2. Install CocoaPods:
   \`cd ios/App && pod install\`
3. Open Xcode Workspace:
   \`npx cap open ios\`
4. Archive and Upload to App Store Connect via Xcode Product > Archive.
`);
  }

  if (target === 'pwa') {
    zip.file('manifest.json', generatePWAManifest(tenant, identity));
    zip.file('sw.js', generateServiceWorker(tenant));
    zip.file('offline.html', generateOfflineHtml(tenant));
    zip.file('index.html', generatePWAIndexHtml(tenant, identity));
    zip.file('robots.txt', `User-agent: *\nAllow: /\nSitemap: https://${tenant.domain}/sitemap.xml\n`);
    zip.file('README.md', `# ${tenant.name} - PWA & Static Web Bundle

This package is a standalone Progressive Web App bundle ready to upload to any static hosting:
- Cloudflare Pages
- Netlify (drag and drop)
- Vercel
- GitHub Pages / AWS S3

Includes full offline caching, Add to Home Screen (A2HS) support, and fullscreen mobile experience.
`);
  }

  if (target === 'self_hosted') {
    zip.file('docker-compose.yml', generateDockerCompose(tenant));
    zip.file('Dockerfile', generateDockerfile(tenant));
    zip.file('nginx.conf', generateNginxConf(tenant));
    zip.file('server.js', generateSelfHostedServerJs(tenant));
    zip.file('deploy.sh', generateDeployScript(tenant));
    zip.file('.env.production', `NODE_ENV=production\nPORT=3000\nSTORE_SLUG=${tenant.slug}\nSTORE_DOMAIN=${tenant.domain}\n`);
    
    const publicFolder = zip.folder('public');
    publicFolder?.file('index.html', generatePWAIndexHtml(tenant, identity));
    publicFolder?.file('manifest.json', generatePWAManifest(tenant, identity));
    publicFolder?.file('sw.js', generateServiceWorker(tenant));
    publicFolder?.file('offline.html', generateOfflineHtml(tenant));

    zip.file('README.md', `# ${tenant.name} - Sovereign Self-Hosted Docker Package

## 1-Click Launch:
\`\`\`bash
chmod +x deploy.sh
./deploy.sh
\`\`\`

Or manually with Docker Compose:
\`\`\`bash
docker compose up -d --build
\`\`\`

Your store will be active on port 80/443 via the automated Nginx reverse proxy!
`);
  }

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Helper to trigger client-side file download
 */
export function downloadTextFile(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Helper to trigger client-side Blob download (ZIP files)
 */
export function downloadBlobFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

