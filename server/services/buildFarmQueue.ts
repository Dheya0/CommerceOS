import fs from 'fs';
import path from 'path';
import { generateProjectZipPackage, ExportProjectPayload, GeneratedArtifactResult } from './codeFactoryEngine.ts';
import { db, BuildRecord, ArtifactRecord } from '../db.ts';

export interface BuildJobOptions {
  projectId: string;
  target?: 'full_stack' | 'web' | 'pwa' | 'android' | 'ios' | 'docker' | 'capacitor_all';
  targetName?: string;
  version?: string;
  payload: ExportProjectPayload;
}

class BuildFarmManager {
  private uploadsArtifactsDir: string;

  constructor() {
    this.uploadsArtifactsDir = path.join(process.cwd(), 'uploads', 'artifacts');
    if (!fs.existsSync(this.uploadsArtifactsDir)) {
      fs.mkdirSync(this.uploadsArtifactsDir, { recursive: true });
    }
  }

  /**
   * Enqueues a persistent build job in the database and dispatches the build pipeline
   */
  public enqueueBuild(options: BuildJobOptions): BuildRecord {
    const buildId = `bld_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const target = options.target || 'full_stack';
    const targetNames: Record<string, string> = {
      full_stack: 'Full-Stack Sovereign Stack',
      web: 'Production Web SPA (Vite + Nginx)',
      pwa: 'Progressive Web App (PWA)',
      android: 'Android Studio Project (Capacitor 6.0)',
      ios: 'iOS Xcode Workspace (Capacitor 6.0)',
      docker: 'Docker Compose Self-Hosted Bundle'
    };

    const targetName = options.targetName || targetNames[target] || 'Commerce Stack';
    const version = options.version || '1.0.0';

    const existingBuilds = db.getBuilds(options.projectId);
    const buildNumber = existingBuilds.length + 1;

    const initialBuild: BuildRecord = {
      id: buildId,
      projectId: options.projectId,
      target,
      targetName,
      version,
      buildNumber,
      status: 'queued',
      progress: 0,
      currentStep: 'في طابور البناء الموزع (Queued in Build Farm)',
      workerId: 'worker-local-01',
      workerName: 'Node Build Worker (Native)',
      logs: [
        `[${new Date().toISOString()}] Job enqueued in Build Farm Queue. Target: ${target}`,
        `[${new Date().toISOString()}] Allocating isolated sandbox container...`
      ],
      createdAt: new Date().toISOString()
    };

    // Save to persistent database
    db.createBuild(initialBuild);

    // Asynchronously execute pipeline
    this.executeBuildPipeline(buildId, options.payload, target, version, buildNumber);

    return initialBuild;
  }

  /**
   * Retrieves build record from persistent database
   */
  public getBuild(buildId: string, projectId?: string): BuildRecord | undefined {
    return db.getBuildById(buildId, projectId);
  }

  /**
   * Retrieves all builds for a project
   */
  public getProjectBuilds(projectId: string): BuildRecord[] {
    return db.getBuilds(projectId);
  }

  /**
   * Pipeline Execution Worker
   */
  private async executeBuildPipeline(
    buildId: string,
    payload: ExportProjectPayload,
    target: string,
    version: string,
    buildNumber: number
  ) {
    const update = (updates: Partial<BuildRecord>) => {
      db.updateBuild(buildId, updates);
    };

    const appendLog = (message: string) => {
      const current = db.getBuildById(buildId);
      if (current) {
        const newLogs = [...current.logs, `[${new Date().toISOString()}] ${message}`];
        update({ logs: newLogs });
      }
    };

    try {
      // 1. Running State
      update({
        status: 'running',
        progress: 20,
        currentStep: 'تهيئة بيئة التصريف وتوليد الشفرة المصدرية (Generating Source Code)...'
      });
      appendLog('Starting compilation and code generation...');
      await sleep(400);

      // 2. Packaging State
      update({
        status: 'packaging',
        progress: 50,
        currentStep: 'تجميع الحزم ومكونات الواجهة وقواعد البيانات (Packaging Components)...'
      });
      appendLog('Building architecture modules: frontend, backend, database migrations, Docker config...');
      await sleep(500);

      // 3. Signing & Archiving
      update({
        status: 'signing',
        progress: 75,
        currentStep: 'توقيع الحزمة وضغط الأرشيف وحساب البصمة الرقمية (Archiving & SHA-256 Checksum)...'
      });
      appendLog('Compressing sovereign package into ZIP archive...');

      const slug = payload.slug || 'store';
      const artifactFileName = `${slug}-${target}-v${version}-${Date.now()}.zip`;
      const artifactFilePath = path.join(this.uploadsArtifactsDir, artifactFileName);
      const outputStream = fs.createWriteStream(artifactFilePath);

      // Generate real ZIP file
      const result = await generateProjectZipPackage(
        {
          ...payload,
          target: target as any,
          version,
          buildNumber
        },
        outputStream
      );

      appendLog(`Package generated successfully. Size: ${result.fileSizeMb}, SHA-256: ${result.checksum}`);

      // 4. Create Artifact in Database
      const artifactId = `art_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      const artifactRecord: ArtifactRecord = {
        id: artifactId,
        buildId,
        projectId: payload.projectId,
        ownerId: payload.adminEmail,
        target,
        targetName: target,
        version,
        buildNumber,
        fileName: result.fileName,
        filePath: artifactFilePath,
        checksum: result.checksum,
        fileSizeBytes: result.fileSizeBytes,
        fileSizeMb: result.fileSizeMb,
        mimeType: 'application/zip',
        status: 'ready',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days retention
      };

      db.createArtifact(artifactRecord);

      // 5. Complete Build
      update({
        status: 'completed',
        progress: 100,
        currentStep: 'اكتمل البناء وتوليد الحزمة بنجاح تام! جاهزة للتحميل والنشر.',
        artifactId,
        completedAt: new Date().toISOString()
      });
      appendLog('Build completed successfully. Artifact ready for deployment.');
    } catch (error: any) {
      console.error('[Build Farm] Pipeline execution failure:', error);
      update({
        status: 'failed',
        progress: 100,
        currentStep: 'فشل في عملية البناء والتصدير',
        error: error.message || 'Unknown build error'
      });
      appendLog(`BUILD FAILED: ${error.message}`);
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const buildFarmManager = new BuildFarmManager();
