import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as archiverModule from 'archiver';
const archiver = (archiverModule as any).default || archiverModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ExportStorePayload {
  storeId: string;
  storeName: string;
  storeNameEn: string;
  slug: string;
  currency: string;
  primaryColor: string;
  secondaryColor: string;
  supportEmail: string;
  whatsappPhone: string;
  businessType: string;
  logoUrl?: string;
  bannerUrl?: string;
  adminEmail: string;
  adminName: string;
  hasLicense?: boolean; // White-label license status
  products?: Array<{
    name: string;
    price: number;
    category: string;
    image?: string;
  }>;
  categories?: Array<{
    name: string;
    slug: string;
  }>;
}

/**
 * The Code Factory Engine
 * 1. Copies Store_Base_Template to a temp directory.
 * 2. Performs String Interpolation on template files.
 * 3. Seeds database (store.sqlite / JSON seed).
 * 4. Compresses into a zip stream using archiver.
 */
export async function generateStoreZipPackage(
  payload: ExportStorePayload,
  outputStream: fs.WriteStream
): Promise<{ filePath: string; fileName: string; fileSizeMb: string }> {
  const rootDir = process.cwd();
  const templateDir = path.join(rootDir, 'Store_Base_Template');
  const tempBuildId = `temp_build_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const tempDir = path.join(rootDir, 'uploads', tempBuildId);

  // Ensure template exists, if not create a fallback structure programmatically
  if (!fs.existsSync(templateDir)) {
    fs.mkdirSync(templateDir, { recursive: true });
    fs.mkdirSync(path.join(templateDir, 'server'), { recursive: true });
    fs.mkdirSync(path.join(templateDir, 'prisma'), { recursive: true });
    fs.mkdirSync(path.join(templateDir, 'src'), { recursive: true });

    fs.writeFileSync(
      path.join(templateDir, 'package.json'),
      JSON.stringify(
        {
          name: payload.slug || 'store-template',
          version: '1.0.0',
          scripts: { start: 'node server/index.js' },
          dependencies: { express: '^4.19.2', cors: '^2.8.5' }
        },
        null,
        2
      )
    );
    fs.writeFileSync(
      path.join(templateDir, 'server/index.js'),
      `const express = require('express');\nconst app = express();\napp.get('/', (r,s)=>s.send('Store: {{STORE_NAME}}'));\napp.listen(3000);`
    );
  }

  // 1. Copy Store_Base_Template to temp directory
  copyRecursiveSync(templateDir, tempDir);

  // 2. String Interpolation across files
  const hasWatermark = !payload.hasLicense; // If licensed, watermark is disabled (clean white-label export)
  const replacements: Record<string, string> = {
    '{{STORE_ID}}': payload.storeId || 'store-1',
    '{{STORE_NAME}}': payload.storeName || 'متجري الإلكتروني',
    '{{STORE_NAME_EN}}': payload.storeNameEn || payload.slug || 'My Store',
    '{{STORE_CURRENCY}}': payload.currency || 'SAR',
    '{{PRIMARY_COLOR}}': payload.primaryColor || '#2563eb',
    '{{SECONDARY_COLOR}}': payload.secondaryColor || '#1e40af',
    '{{LOGO_URL}}': payload.logoUrl || '',
    '{{BANNER_URL}}': payload.bannerUrl || '',
    '{{SUPPORT_EMAIL}}': payload.supportEmail || payload.adminEmail || 'support@store.com',
    '{{WHATSAPP_PHONE}}': payload.whatsappPhone || '+966500000000',
    '{{BUSINESS_TYPE}}': payload.businessType || 'general',
    '{{DEFAULT_PRODUCT_NAME}}': payload.products?.[0]?.name || 'منتج تجريبي فاخر',
    '{{DEFAULT_PRODUCT_IMAGE}}': payload.products?.[0]?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    '{{DEFAULT_CATEGORY}}': payload.categories?.[0]?.name || 'عام',
    '{{HAS_WATERMARK}}': hasWatermark ? 'true' : 'false'
  };

  interpolateFilesInDirectory(tempDir, replacements);

  // 3. Database Seeding (Generate store-seed.json & SQL schema setup)
  const dbSeedData = {
    store: {
      name: payload.storeName,
      currency: payload.currency,
      adminEmail: payload.adminEmail,
      adminName: payload.adminName,
      createdAt: new Date().toISOString()
    },
    categories: payload.categories || [{ name: 'الرئيسية', slug: 'main' }],
    products: payload.products || []
  };

  const seedFilePath = path.join(tempDir, 'store-seed.json');
  fs.writeFileSync(seedFilePath, JSON.stringify(dbSeedData, null, 2), 'utf-8');

  const readmeContent = `# ${payload.storeName} (${payload.slug})
تم توليد هذا المتجر الآلي بالكامل عبر منصة CommerceOS السحابية.

## تعليمات التشغيل:
1. تأكد من تثبيت Node.js (الإصدار 18 أو أحدث).
2. قم بتثبيت الحزم عبر الأمر: \`npm install\`
3. قم بتشغيل المتجر عبر الأمر: \`npm start\`
4. سيرفر الباك إند سيعمل على المنفذ 3000 تلقائياً.

العملية برمتها مدعومة ببيانات الاعتماد وقاعدة البيانات المضمنة في الملفات.
`;
  fs.writeFileSync(path.join(tempDir, 'README.md'), readmeContent, 'utf-8');

  // 4. Compress into a ZIP archive using archiver
  await new Promise<void>((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });

    outputStream.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(outputStream);
    archive.directory(tempDir, false);
    archive.finalize();
  });

  const stats = fs.statSync((outputStream as any).path || '');
  const fileSizeMb = (stats.size / (1024 * 1024)).toFixed(2) + ' MB';
  const fileName = `${payload.slug || 'store'}-export-package.zip`;

  // Cleanup temp directory
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {
    // ignore cleanup error
  }

  return {
    filePath: (outputStream as any).path,
    fileName,
    fileSizeMb
  };
}

function copyRecursiveSync(src: string, dest: string) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function interpolateFilesInDirectory(dir: string, replacements: Record<string, string>) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        interpolateFilesInDirectory(fullPath, replacements);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.ico', '.zip', '.sqlite', '.pdf'].includes(ext)) {
        continue;
      }
      try {
        let content = fs.readFileSync(fullPath, 'utf-8');
        let modified = false;
        for (const [key, val] of Object.entries(replacements)) {
          if (content.includes(key)) {
            content = content.replaceAll(key, val);
            modified = true;
          }
        }
        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf-8');
        }
      } catch (e) {
        // ignore read/write error for non-text files
      }
    }
  }
}
