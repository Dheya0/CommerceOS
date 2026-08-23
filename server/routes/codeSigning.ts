import { Router, Request, Response } from 'express';

export const codeSigningRouter = Router();

// GET /api/v1/code-signing/generate-script - Generate custom keystore command and gradle config
codeSigningRouter.post('/generate-script', (req: Request, res: Response) => {
  const { 
    platform, 
    keystoreAlias, 
    keystorePassword, 
    keyPassword, 
    validityYears, 
    commonName, 
    organization, 
    countryCode,
    bundleId,
    teamId 
  } = req.body;

  if (platform === 'android') {
    const alias = keystoreAlias || 'release-key';
    const storePass = keystorePassword || 'MySecurePassword2026';
    const keyPass = keyPassword || 'MySecurePassword2026';
    const years = validityYears || 25;
    const validityDays = years * 365;
    const dname = `CN=${commonName || 'Merchant Admin'}, O=${organization || 'CommerceOS Store'}, C=${countryCode || 'SA'}`;

    const keytoolCommand = `keytool -genkey -v -keystore release.keystore -alias "${alias}" -keyalg RSA -keysize 2048 -validity ${validityDays} -storepass "${storePass}" -keypass "${keyPass}" -dname "${dname}"`;

    const gradleSigningBlock = `
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            storeFile file("release.keystore")
            storePassword "${storePass}"
            keyAlias "${alias}"
            keyPassword "${keyPass}"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}`;

    return res.json({
      success: true,
      platform: 'android',
      keytoolCommand,
      gradleSigningBlock,
      instructions: [
        '1. افتح موجه الأوامر (Terminal) في مجلد android/app داخل مشروعك.',
        '2. الصق ونفذ أمر keytool المولد أدناه لإنشاء ملف release.keystore.',
        '3. أضف إعدادات signingConfigs إلى ملف android/app/build.gradle.',
        '4. قم بتشغيل الأمر ./gradlew bundleRelease لتوليد ملف AAB الموقّع والجاهز للرفع على Google Play Console.'
      ]
    });
  }

  // iOS Code Signing Configuration
  const exportOptionsPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>${teamId || 'TEAM_ID_HERE'}</string>
    <key>signingStyle</key>
    <string>manual</string>
    <key>provisioningProfiles</key>
    <dict>
        <key>${bundleId || 'com.store.app'}</key>
        <string>Store_AppStore_Profile</string>
    </dict>
</dict>
</plist>`;

  res.json({
    success: true,
    platform: 'ios',
    exportOptionsPlist,
    instructions: [
      '1. افتح المشروع في Xcode عبر فتح App.xcworkspace.',
      '2. اختر Team الخاص بحساب Apple Developer المسجل.',
      '3. تأكد من تطابق Bundle Identifier مع شهادة التوزيع (Distribution Certificate).',
      '4. اختر Product > Archive ثم اضغط Distribute App لرفع النسخة مباشرة إلى TestFlight أو App Store Connect.'
    ]
  });
});
