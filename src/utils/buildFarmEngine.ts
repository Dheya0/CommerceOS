import { BuildWorkerNode, BuildJobQueueItem, BuildFarmMetrics, DeliveryTarget, TenantStore, AppIdentityConfig } from '../types';

export interface BuildStreamSubscriber {
  (update: {
    jobId: string;
    progress: number;
    step: string;
    status: BuildJobQueueItem['status'];
    log?: string;
    metrics?: { cpu: number; ram: number };
    artifactUrl?: string;
    queuePosition?: number;
  }): void;
}

class BuildFarmEngine {
  private workers: BuildWorkerNode[] = [
    {
      id: 'worker-node-riyadh-01',
      name: 'KSA-Riyadh-Worker-Alpha (ARM64)',
      region: 'me-central2 (Riyadh)',
      status: 'idle',
      cpuLoad: 12,
      ramLoad: 28,
      completedJobsCount: 142,
      uptimeHours: 368,
      ip: '10.140.2.14'
    },
    {
      id: 'worker-node-jeddah-02',
      name: 'KSA-Jeddah-Worker-Beta (x86_64)',
      region: 'me-central2 (Jeddah)',
      status: 'idle',
      cpuLoad: 18,
      ramLoad: 34,
      completedJobsCount: 98,
      uptimeHours: 194,
      ip: '10.140.3.88'
    },
    {
      id: 'worker-node-fra-03',
      name: 'EU-Frankfurt-Capacitor-Farm (Dedicated)',
      region: 'europe-west3 (Frankfurt)',
      status: 'busy',
      currentJobId: 'job-98214',
      currentTenantName: 'عود لاند الفاخر',
      currentStage: 'Compiling Gradle / Android APK',
      cpuLoad: 68,
      ramLoad: 62,
      completedJobsCount: 310,
      activeTarget: 'android',
      uptimeHours: 840,
      ip: '10.180.1.5'
    },
    {
      id: 'worker-node-us-04',
      name: 'US-Virginia-Docker-Synthesis-Node',
      region: 'us-east4 (Virginia)',
      status: 'idle',
      cpuLoad: 8,
      ramLoad: 22,
      completedJobsCount: 420,
      uptimeHours: 1200,
      ip: '10.190.5.21'
    }
  ];

  private queue: BuildJobQueueItem[] = [
    {
      id: 'job-sample-01',
      tenantId: 'tenant-demo-02',
      tenantName: 'متجر أصالة نجد',
      target: 'pwa',
      targetName: 'PWA Distribution',
      version: '1.4.2',
      buildNumber: 19,
      status: 'ready',
      priority: 'vip_enterprise',
      progress: 100,
      currentStep: 'Build artifacts archived and signed',
      queuedAt: new Date(Date.now() - 3600000).toISOString(),
      startedAt: new Date(Date.now() - 3590000).toISOString(),
      completedAt: new Date(Date.now() - 3584000).toISOString(),
      workerId: 'worker-node-riyadh-01',
      workerName: 'KSA-Riyadh-Worker-Alpha',
      estimatedRemainingSec: 0,
      logs: [
        '[Redis/BullMQ] Job dequeued by Worker #worker-node-riyadh-01',
        '[Manifest Engine] Synthesizing manifest.webmanifest + Icons',
        '[ServiceWorker] Compiling Workbox cache strategies',
        '[Done] Exported 3.4 MB PWA Bundle successfully'
      ]
    }
  ];

  private activeSubscriptions = new Map<string, Set<BuildStreamSubscriber>>();

  constructor() {
    // Start automated background telemetry heartbeat
    setInterval(() => {
      this.simulateWorkerHeartbeat();
    }, 4000);
  }

  public getWorkers(): BuildWorkerNode[] {
    return [...this.workers];
  }

  public getQueue(): BuildJobQueueItem[] {
    return [...this.queue];
  }

  public getFarmMetrics(): BuildFarmMetrics {
    const totalWorkers = this.workers.length;
    const activeWorkers = this.workers.filter(w => w.status === 'busy').length;
    const idleWorkers = totalWorkers - activeWorkers;
    const queuedJobs = this.queue.filter(j => j.status === 'queued').length;
    const activeJobs = this.queue.filter(j => ['claimed', 'compiling', 'bundling', 'signing'].includes(j.status)).length;
    const completedToday = this.queue.filter(j => j.status === 'ready').length + 84;
    
    const avgCpu = Math.round(this.workers.reduce((acc, w) => acc + w.cpuLoad, 0) / (totalWorkers || 1));

    return {
      totalWorkers,
      activeWorkers,
      idleWorkers,
      queuedJobsCount: queuedJobs,
      activeJobsCount: activeJobs,
      completedTodayCount: completedToday,
      avgBuildTimeSec: 4.8,
      totalCpuCapacityCores: 64,
      usedCpuPercentage: avgCpu,
      redisQueueHealth: 'optimal',
      redisMemoryUsageMb: 142.6,
      socketConnectionsCount: 18 + this.activeSubscriptions.size
    };
  }

  public subscribeToJob(jobId: string, subscriber: BuildStreamSubscriber): () => void {
    if (!this.activeSubscriptions.has(jobId)) {
      this.activeSubscriptions.set(jobId, new Set());
    }
    this.activeSubscriptions.get(jobId)!.add(subscriber);

    // If job already exists, emit initial state immediately
    const existingJob = this.queue.find(j => j.id === jobId);
    if (existingJob) {
      subscriber({
        jobId,
        progress: existingJob.progress,
        step: existingJob.currentStep,
        status: existingJob.status,
        queuePosition: existingJob.status === 'queued' ? 1 : 0
      });
    }

    return () => {
      const set = this.activeSubscriptions.get(jobId);
      if (set) {
        set.delete(subscriber);
        if (set.size === 0) {
          this.activeSubscriptions.delete(jobId);
        }
      }
    };
  }

  private emitJobUpdate(jobId: string, update: Parameters<BuildStreamSubscriber>[0]) {
    const subscribers = this.activeSubscriptions.get(jobId);
    if (subscribers) {
      subscribers.forEach(sub => sub(update));
    }
  }

  public enqueueJob(
    tenant: TenantStore, 
    target: DeliveryTarget, 
    identityConfig: AppIdentityConfig
  ): { job: BuildJobQueueItem; initialPosition: number } {
    const jobId = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const priority: BuildJobQueueItem['priority'] = tenant.plan === 'pro' || tenant.licensing?.isWhiteLabel 
      ? 'vip_enterprise' 
      : tenant.plan === 'business' 
        ? 'growth' 
        : 'standard';

    const targetNames: Record<DeliveryTarget, string> = {
      web: 'Web Static Bundle (Vite/React)',
      pwa: 'Progressive Web App (Sovereign PWA)',
      android: 'Capacitor Native Android (APK/AAB)',
      ios: 'Apple iOS Xcode Project (CocoaPods)',
      self_hosted: 'Docker Compose & VPS Standalone Stack',
      desktop: 'Tauri Desktop Distribution'
    };

    const newJob: BuildJobQueueItem = {
      id: jobId,
      tenantId: tenant.id,
      tenantName: tenant.name,
      target,
      targetName: targetNames[target] || target.toUpperCase(),
      version: identityConfig.version,
      buildNumber: identityConfig.buildNumber + 1,
      status: 'queued',
      priority,
      progress: 0,
      currentStep: 'تم إدراج المهمة في طابور Redis/BullMQ بانتظار عقدة معالجة معزولة...',
      queuedAt: new Date().toISOString(),
      estimatedRemainingSec: target === 'ios' || target === 'android' ? 12 : 6,
      logs: [
        `[Redis Queue Broker] Enqueued Job #${jobId} | Priority: ${priority.toUpperCase()}`,
        `[Tenant Security] Verified licensing status: ${tenant.licensing?.isWhiteLabel ? 'White-Label Clean' : 'Core Watermarked'}`,
        `[Payload] BundleId: ${identityConfig.bundleId} | Version: ${identityConfig.version}`
      ]
    };

    this.queue.unshift(newJob);
    const queuedCount = this.queue.filter(j => j.status === 'queued').length;

    // Start background processing pipeline for this job
    setTimeout(() => {
      this.processJobPipeline(jobId, tenant, target, identityConfig);
    }, 600);

    return { job: newJob, initialPosition: queuedCount };
  }

  private processJobPipeline(
    jobId: string, 
    tenant: TenantStore, 
    target: DeliveryTarget, 
    identityConfig: AppIdentityConfig
  ) {
    const jobIndex = this.queue.findIndex(j => j.id === jobId);
    if (jobIndex === -1) return;

    // Pick an available worker or scale one
    let availableWorker = this.workers.find(w => w.status === 'idle');
    if (!availableWorker) {
      availableWorker = this.workers[0]; // fallback
    }

    // Mark Worker Busy
    availableWorker.status = 'busy';
    availableWorker.currentJobId = jobId;
    availableWorker.currentTenantName = tenant.name;
    availableWorker.activeTarget = target;
    availableWorker.cpuLoad = Math.floor(Math.random() * 25) + 55;
    availableWorker.ramLoad = Math.floor(Math.random() * 20) + 60;

    // Update Job Status: Claimed
    this.queue[jobIndex].status = 'claimed';
    this.queue[jobIndex].startedAt = new Date().toISOString();
    this.queue[jobIndex].workerId = availableWorker.id;
    this.queue[jobIndex].workerName = availableWorker.name;
    this.queue[jobIndex].progress = 12;
    this.queue[jobIndex].currentStep = `العقدة ${availableWorker.name} تسلّمت المهمة وبدأت التهيئة المعزولة...`;

    this.emitJobUpdate(jobId, {
      jobId,
      progress: 12,
      step: this.queue[jobIndex].currentStep,
      status: 'claimed',
      log: `[Worker Handshake] Claimed by ${availableWorker.name} (${availableWorker.region})`,
      metrics: { cpu: availableWorker.cpuLoad, ram: availableWorker.ramLoad }
    });

    const executionSteps = [
      {
        progress: 28,
        status: 'compiling' as const,
        step: 'توليد شجرة المكونات وتطبيق سمات التصميم (Tokens Injection)...',
        log: `[JIT Token Engine] Primary Color: ${tenant.theme.tokens.primary} | Radius: ${tenant.theme.radius}`
      },
      {
        progress: 48,
        status: 'compiling' as const,
        step: 'توليد أيقونات المنصات وشاشات الترحيب التفاعلية (Asset Synthesizer)...',
        log: `[Asset Pipeline] Generated 18 App Icons & Adaptive Splash Textures for ${target.toUpperCase()}`
      },
      {
        progress: 68,
        status: 'bundling' as const,
        step: target === 'android' || target === 'ios'
          ? 'بناء حزمة Capacitor والمكتبات الأصلية (Gradle / CocoaPods)...'
          : target === 'self_hosted'
            ? 'تجهيز ملفات Dockerfile و Nginx Reverse Proxy وعزل البيئة...'
            : 'توليد ملفات PWA ServiceWorker واستراتيجيات التخزين المؤقت...',
        log: `[Build Matrix] Target compiler execution: ${target} platform modules compiled cleanly`
      },
      {
        progress: 88,
        status: 'signing' as const,
        step: 'الفحص الأمني، التوقيع الرقمي (Code Signing) والتحقق من التراخيص...',
        log: tenant.licensing?.isWhiteLabel 
          ? `[White-Label Guard] Source verified pure: Zero watermarks injected`
          : `[Watermark Injector] Tamper-Resistant integrity badge embedded with Base64 HMAC`
      },
      {
        progress: 100,
        status: 'ready' as const,
        step: 'تم إتمام عملية البناء بنجاح وأصبحت الحزمة جاهزة للتحميل الفوري!',
        log: `[Done] Production package synthesized and ready. SHA256: 9b2d${Date.now().toString(16)}`
      }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < executionSteps.length) {
        const stepData = executionSteps[currentStepIdx];
        if (this.queue[jobIndex]) {
          this.queue[jobIndex].progress = stepData.progress;
          this.queue[jobIndex].status = stepData.status;
          this.queue[jobIndex].currentStep = stepData.step;
          this.queue[jobIndex].logs.push(stepData.log);
          this.queue[jobIndex].estimatedRemainingSec = Math.max(0, (executionSteps.length - currentStepIdx) * 1.2);
          
          if (stepData.progress === 100) {
            this.queue[jobIndex].completedAt = new Date().toISOString();
          }

          // Randomize worker cpu during steps
          if (availableWorker) {
            availableWorker.cpuLoad = stepData.progress === 100 ? 10 : Math.min(95, availableWorker.cpuLoad + (Math.random() * 10 - 5));
          }

          this.emitJobUpdate(jobId, {
            jobId,
            progress: stepData.progress,
            step: stepData.step,
            status: stepData.status,
            log: stepData.log,
            metrics: { cpu: Math.round(availableWorker?.cpuLoad || 30), ram: Math.round(availableWorker?.ramLoad || 45) }
          });
        }
        currentStepIdx++;
      } else {
        clearInterval(interval);
        
        // Release Worker back to idle
        if (availableWorker) {
          availableWorker.status = 'idle';
          availableWorker.currentJobId = undefined;
          availableWorker.currentTenantName = undefined;
          availableWorker.activeTarget = undefined;
          availableWorker.cpuLoad = Math.floor(Math.random() * 15) + 5;
          availableWorker.ramLoad = Math.floor(Math.random() * 15) + 20;
          availableWorker.completedJobsCount += 1;
        }
      }
    }, 700);
  }

  private simulateWorkerHeartbeat() {
    this.workers.forEach(worker => {
      if (worker.status === 'idle') {
        worker.cpuLoad = Math.max(4, Math.min(25, worker.cpuLoad + (Math.floor(Math.random() * 7) - 3)));
      } else if (worker.status === 'busy') {
        worker.cpuLoad = Math.max(50, Math.min(96, worker.cpuLoad + (Math.floor(Math.random() * 11) - 5)));
      }
    });
  }
}

export const buildFarm = new BuildFarmEngine();
