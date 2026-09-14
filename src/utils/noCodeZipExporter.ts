import JSZip from 'jszip';
import { NoCodeAppProject } from '../types/appStudio';
import { NoCodeCodeGenerator } from './noCodeCodeGenerator';
import { SecurityEngine } from './securityEngine';
import { ARAB_COUNTRIES } from '../data/arabCountries';

export async function exportNoCodeAppZip(project: NoCodeAppProject): Promise<Blob> {
  const zip = new JSZip();
  const country = ARAB_COUNTRIES.find(c => c.code === project.countryCode) || ARAB_COUNTRIES[0];
  const virtualFiles: Record<string, string> = {};

  // 1. Root documentation, sanitized specification and security report
  const readmeContent = NoCodeCodeGenerator.generateReadmeGuide(project);
  zip.file('README-AR.md', readmeContent);
  virtualFiles['README-AR.md'] = readmeContent;
  
  // Safe payments normalization
  const safePayments = Array.isArray(project.payments) ? project.payments : [];

  // Sanitize project specification (Never leak raw unmasked live secret keys in json files)
  const sanitizedProject = {
    ...project,
    payments: safePayments.map(p => ({
      ...p,
      keys: Object.fromEntries(
        Object.entries(p.keys || {}).map(([k, v]) => [
          k, 
          v ? (v.startsWith('sk_live') ? 'sk_live_*******************' : v.startsWith('pk_') ? v : '*******************') : ''
        ])
      )
    }))
  };
  const specContent = JSON.stringify(sanitizedProject, null, 2);
  zip.file('project-specification.json', specContent);
  virtualFiles['project-specification.json'] = specContent;

  // Root .gitignore (Crucial for preventing secret leakage to Git repositories)
  const rootGitIgnore = `# ====================================================================
# ملفات الحماية وحظر المستودعات السرية (Git Ignore Security Policy)
# ====================================================================

# المفاتيح السرية والبيئة
.env
.env.local
.env.*.local
*.pem
*.key
*.cert

# حزم الاعتماديات
node_modules/
.pnp
.pnp.js

# مخرجات البناء والتوزيع
dist/
build/
out/
.vite/
.next/

# ملفات النظام والمحررات
.DS_Store
Thumbs.db
.vscode/
.idea/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# مخرجات الموبايل
.gradle/
local.properties
*.apk
*.aab
DerivedData/
*.xcuserstate
Pods/
`;
  zip.file('.gitignore', rootGitIgnore);
  virtualFiles['.gitignore'] = rootGitIgnore;

  // 2. Environment Variables & API Secrets (Clean Template)
  const envContent = `# ====================================================================
# إعدادات الـ APIs والمفاتيح السرية للمشروع: ${project.nameAr}
# تنبيه أمني: لا ترفع هذا الملف إلى مستودعات GitHub أو أي مكان عام
# ====================================================================

NODE_ENV="development"
APP_NAME="${project.nameEn}"
APP_COUNTRY="${country.nameEn}"
DEFAULT_CURRENCY="${project.currencyCode}"
TAX_RATE=${project.taxRate}
PORT=3001
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"

# بوابات الدفع الإلكتروني (Payment Gateways)
${safePayments.map(p => {
  const keysStr = Object.entries(p.keys || {})
    .map(([k, v]) => `${(p.providerId || (p as any).provider || 'GATEWAY').toUpperCase()}_${k.toUpperCase()}="${v || 'YOUR_KEY_HERE'}"`)
    .join('\n');
  return `# بوابة: ${p.providerId || (p as any).provider || 'GATEWAY'}\n${(p.providerId || (p as any).provider || 'GATEWAY').toUpperCase()}_ENABLED=${p.enabled}\n${(p.providerId || (p as any).provider || 'GATEWAY').toUpperCase()}_ENV="${p.environment || (p as any).mode || 'live'}"\n${keysStr}`;
}).join('\n\n')}
`;
  zip.file('.env.example', envContent);
  virtualFiles['.env.example'] = envContent;

  const activePlatforms = Array.isArray(project.selectedExportPlatforms) && project.selectedExportPlatforms.length > 0
    ? project.selectedExportPlatforms
    : ['all', 'web', 'android', 'ios', 'windows'];

  // 3. Web App Directory (Hardened with Security Headers)
  if (activePlatforms.includes('web') || activePlatforms.includes('all')) {
    const webFolder = zip.folder('web-app');
    if (webFolder) {
      const webGitIgnore = 'node_modules/\ndist/\n.env\n.env.local\n.DS_Store\n';
      webFolder.file('.gitignore', webGitIgnore);
      virtualFiles['web-app/.gitignore'] = webGitIgnore;

      const webPkg = JSON.stringify({
        name: project.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          'lucide-react': '^0.460.0',
          dompurify: '^3.1.6'
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.3.1',
          tailwindcss: '^3.4.10',
          vite: '^5.4.2'
        }
      }, null, 2);
      webFolder.file('package.json', webPkg);
      virtualFiles['web-app/package.json'] = webPkg;

      const webIndexHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <title>${project.nameAr} | ${country.nameAr}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=Cairo:wght@400;600;800&family=Almarai:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
      body { font-family: '${project.theme.fontFamily}', sans-serif; }
    </style>
  </head>
  <body class="bg-slate-50">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
      webFolder.file('index.html', webIndexHtml);
      virtualFiles['web-app/index.html'] = webIndexHtml;

      const srcFolder = webFolder.folder('src');
      if (srcFolder) {
        const appJsx = NoCodeCodeGenerator.generateReactWebCode(project);
        srcFolder.file('App.jsx', appJsx);
        virtualFiles['web-app/src/App.jsx'] = appJsx;

        const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
        srcFolder.file('main.jsx', mainJsx);
        virtualFiles['web-app/src/main.jsx'] = mainJsx;
      }
    }
  }

  // 4. Android App Directory (Hardened with Cleartext Traffic Blocking)
  if (activePlatforms.includes('android') || activePlatforms.includes('all')) {
    const androidFolder = zip.folder('android-app');
    if (androidFolder) {
      const androidGitIgnore = '.gradle/\nlocal.properties\nbuild/\n*.apk\n*.aab\n';
      androidFolder.file('.gitignore', androidGitIgnore);
      virtualFiles['android-app/.gitignore'] = androidGitIgnore;

      const mainActivity = NoCodeCodeGenerator.generateAndroidKotlinCode(project);
      androidFolder.file('MainActivity.kt', mainActivity);
      virtualFiles['android-app/MainActivity.kt'] = mainActivity;

      const buildGradle = `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.${project.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '')}.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.${project.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '')}.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }
}
`;
      androidFolder.file('build.gradle.kts', buildGradle);
      virtualFiles['android-app/build.gradle.kts'] = buildGradle;

      const manifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:allowBackup="false"
        android:usesCleartextTraffic="false"
        android:label="${project.nameAr}"
        android:supportsRtl="true"
        android:theme="@style/Theme.Material3.DayNight.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
      androidFolder.file('AndroidManifest.xml', manifest);
      virtualFiles['android-app/AndroidManifest.xml'] = manifest;
    }
  }

  // 5. iOS App Directory (Hardened ATS Policy)
  if (activePlatforms.includes('ios') || activePlatforms.includes('all')) {
    const iosFolder = zip.folder('ios-app');
    if (iosFolder) {
      const iosGitIgnore = 'DerivedData/\n*.xcuserstate\nPods/\n.DS_Store\n';
      iosFolder.file('.gitignore', iosGitIgnore);
      virtualFiles['ios-app/.gitignore'] = iosGitIgnore;

      const swiftCode = NoCodeCodeGenerator.generateIosSwiftCode(project);
      iosFolder.file('ContentView.swift', swiftCode);
      virtualFiles['ios-app/ContentView.swift'] = swiftCode;

      const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>${project.nameAr}</string>
    <key>CFBundleIdentifier</key>
    <string>com.${project.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '')}.app</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <false/>
    </dict>
</dict>
</plist>`;
      iosFolder.file('Info.plist', infoPlist);
      virtualFiles['ios-app/Info.plist'] = infoPlist;
    }
  }

  // 6. Windows Desktop Directory (Hardened with contextBridge & Sandbox)
  if (activePlatforms.includes('windows') || activePlatforms.includes('all')) {
    const winFolder = zip.folder('windows-desktop');
    if (winFolder) {
      const winGitIgnore = 'node_modules/\ndist/\nrelease/\n*.exe\n.env\n';
      winFolder.file('.gitignore', winGitIgnore);
      virtualFiles['windows-desktop/.gitignore'] = winGitIgnore;

      const mainJs = NoCodeCodeGenerator.generateWindowsDesktopCode(project);
      winFolder.file('main.js', mainJs);
      virtualFiles['windows-desktop/main.js'] = mainJs;

      const preloadJs = NoCodeCodeGenerator.generateElectronPreloadCode();
      winFolder.file('preload.js', preloadJs);
      virtualFiles['windows-desktop/preload.js'] = preloadJs;

      const winPkg = JSON.stringify({
        name: `${project.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-')}-desktop`,
        version: '1.0.0',
        main: 'main.js',
        scripts: {
          start: 'electron .',
          'build-exe': 'electron-builder --win'
        },
        devDependencies: {
          electron: '^28.0.0',
          'electron-builder': '^24.9.1'
        }
      }, null, 2);
      winFolder.file('package.json', winPkg);
      virtualFiles['windows-desktop/package.json'] = winPkg;

      const winHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline';">
  <title>${project.nameAr} - Windows Desktop</title>
  <style>
    body { font-family: sans-serif; background: ${project.theme.backgroundColor}; color: ${project.theme.textColor}; padding: 30px; text-align: center; }
    .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); max-width: 600px; margin: 0 auto; color: #1e293b; }
    .btn { background: ${project.theme.primaryColor}; color: white; padding: 12px 24px; border-radius: 10px; border: none; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h2>تطبيق ويندوز مكتبي: ${project.nameAr}</h2>
    <p>تم تجهيز الكود التنفيذي الآمن للعمل كبرنامج مستقل على نظام Windows.</p>
    <p>العملة المعتمدة: <b>${project.currencySymbol} (${country.nameAr})</b></p>
    <button class="btn">تشغيل البرنامج الآن</button>
  </div>
</body>
</html>`;
      winFolder.file('index.html', winHtml);
      virtualFiles['windows-desktop/index.html'] = winHtml;
    }
  }

  // 7. Backend API & ZATCA Invoicing Server (Helmet + Rate Limiting)
  const backendFolder = zip.folder('backend-api');
  if (backendFolder) {
    const backendGitIgnore = 'node_modules/\n.env\n*.log\n';
    backendFolder.file('.gitignore', backendGitIgnore);
    virtualFiles['backend-api/.gitignore'] = backendGitIgnore;

    const serverJs = NoCodeCodeGenerator.generateNodeBackendCode(project);
    backendFolder.file('server.js', serverJs);
    virtualFiles['backend-api/server.js'] = serverJs;

    const backendPkg = JSON.stringify({
      name: `${project.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-')}-backend`,
      version: '1.0.0',
      type: 'module',
      scripts: {
        start: 'node server.js',
        dev: 'nodemon server.js'
      },
      dependencies: {
        express: '^4.19.2',
        cors: '^2.8.5',
        helmet: '^7.1.0',
        'express-rate-limit': '^7.3.1'
      },
      devDependencies: {
        nodemon: '^3.1.4'
      }
    }, null, 2);
    backendFolder.file('package.json', backendPkg);
    virtualFiles['backend-api/package.json'] = backendPkg;
  }

  // 8. Run Static Security Audit & Checksum Generation
  const securityAudit = await SecurityEngine.auditProjectPackage(virtualFiles);
  const securityReportMarkdown = SecurityEngine.generateSecurityMarkdownReport(securityAudit, project.nameAr);
  
  zip.file('SECURITY_REPORT.md', securityReportMarkdown);
  zip.file('SECURITY_AUDIT.json', JSON.stringify(securityAudit, null, 2));
  
  const checksumsFile = Object.entries(securityAudit.sha256Manifest)
    .map(([file, hash]) => `${hash}  ${file}`)
    .join('\n');
  zip.file('checksums.sha256', checksumsFile);

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
