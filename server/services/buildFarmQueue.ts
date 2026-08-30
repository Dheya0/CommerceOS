import fs from 'fs';
import path from 'path';
import { generateStoreZipPackage, ExportStorePayload } from './codeFactoryEngine';

export interface BuildJob {
  jobId: string;
  tenantId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0 to 100
  currentStep: string;
  steps: Array<{ name: string; status: 'pending' | 'active' | 'done' | 'error' }>;
  filePath?: string;
  fileName?: string;
  fileSizeMb?: string;
  error?: string;
  createdAt: string;
}

class BuildFarmManager {
  private jobs = new Map<string, BuildJob>();

  public createJob(tenantId: string, payload: ExportStorePayload): BuildJob {
    const jobId = `job_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const job: BuildJob = {
      jobId,
      tenantId,
      status: 'queued',
      progress: 0,
      currentStep: 'في طابور الانتظار (Queued in Build Farm)',
      steps: [
        { name: 'تهيئة مساحة البناء المعزولة (Isolate Sandbox)', status: 'pending' },
        { name: 'استنساخ قالب المتجر وحقن المتغيرات (String Interpolation)', status: 'pending' },
        { name: 'زراعة قاعدة البيانات ومفتاح الـ Idempotency', status: 'pending' },
        { name: 'فحص الترخيص وحقن شارة الحماية (AST Watermark)', status: 'pending' },
        { name: 'ضغط الحزمة بصيغة ZIP (Archiver Engine)', status: 'pending' }
      ],
      createdAt: new Date().toISOString()
    };
    this.jobs.set(jobId, job);

    // Asynchronously process the build job (Background Worker Simulation)
    this.processJob(jobId, payload);

    return job;
  }

  public getJob(jobId: string): BuildJob | undefined {
    return this.jobs.get(jobId);
  }

  private async processJob(jobId: string, payload: ExportStorePayload) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    try {
      job.status = 'processing';

      // Step 1: Sandbox
      job.currentStep = 'تهيئة مساحة البناء المعزولة...';
      job.steps[0].status = 'active';
      job.progress = 15;
      await sleep(600);
      job.steps[0].status = 'done';

      // Step 2: Interpolation
      job.currentStep = 'استنساخ قالب المتجر وحقن المتغيرات المرئية...';
      job.steps[1].status = 'active';
      job.progress = 35;
      await sleep(800);
      job.steps[1].status = 'done';

      // Step 3: DB & Idempotency
      job.currentStep = 'زراعة قاعدة البيانات وإنشاء سجلات المنتجات...';
      job.steps[2].status = 'active';
      job.progress = 60;
      await sleep(700);
      job.steps[2].status = 'done';

      // Step 4: Watermark & License
      job.currentStep = payload.hasLicense ? 'ترخيص White-Label مفعل (تخطي شارة الحماية)...' : 'حقن توقيع وحماية شارة CommerceOS الأمنية...';
      job.steps[3].status = 'active';
      job.progress = 80;
      await sleep(600);
      job.steps[3].status = 'done';

      // Step 5: Archiving
      job.currentStep = 'ضغط حزمة المتجر وصياغة ملفات التصدير النهائي (ZIP)...';
      job.steps[4].status = 'active';
      job.progress = 90;

      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const zipFileName = `${payload.slug}-sovereign-${Date.now()}.zip`;
      const zipFilePath = path.join(uploadsDir, zipFileName);
      const outputStream = fs.createWriteStream(zipFilePath);

      const result = await generateStoreZipPackage(payload, outputStream);

      job.steps[4].status = 'done';
      job.status = 'completed';
      job.progress = 100;
      job.currentStep = 'اكتمل بناء الحزمة بنجاح تام!';
      job.filePath = result.filePath;
      job.fileName = result.fileName;
      job.fileSizeMb = result.fileSizeMb;
    } catch (error: any) {
      console.error('[Build Farm] Worker error:', error);
      job.status = 'failed';
      job.currentStep = 'فشل عملية البناء والتصدير';
      job.error = error.message;
      for (const step of job.steps) {
        if (step.status === 'active') step.status = 'error';
      }
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const buildFarmManager = new BuildFarmManager();
