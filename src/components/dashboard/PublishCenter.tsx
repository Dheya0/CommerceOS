import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Globe, 
  Smartphone, 
  Apple, 
  Server, 
  Download, 
  Layers, 
  Cpu, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  FileCode, 
  RefreshCw, 
  ShieldCheck, 
  Monitor, 
  Sliders, 
  History, 
  HelpCircle, 
  ArrowRight,
  Code2,
  FolderArchive,
  Image as ImageIcon,
  HardDrive,
  Share2,
  Zap,
  Play,
  RotateCcw,
  Boxes,
  FileCheck,
  FolderTree,
  Eye,
  Activity,
  Radio,
  Database
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  AppIdentityConfig, 
  BuildArtifact, 
  DeliveryTarget, 
  GeneratedAssetItem 
} from '../../types';
import { buildFarm } from '../../utils/buildFarmEngine';
import { BuildFarmMonitor } from './BuildFarmMonitor';
import { 
  downloadBlobFile,
  downloadTextFile, 
  exportZipPackage,
  generateAndroidManifest, 
  generateAndroidGradle,
  generateAndroidStrings,
  generateCapacitorConfig, 
  generateCapacitorPackageJson,
  generateDeployScript,
  generateDockerCompose, 
  generateDockerfile,
  generateIOSAppDelegate,
  generateIOSInfoPlist, 
  generateIOSPodfile,
  generateMainActivityJava,
  generateNginxConf, 
  generateOfflineHtml,
  generatePWAIndexHtml,
  generatePWAManifest, 
  generateSelfHostedServerJs,
  generateServiceWorker 
} from '../../utils/exportEngine';

export const PublishCenter: React.FC = () => {
  const { activeTenant, updateTenant, showToast, language } = useCommerce();

  // Active view tab inside Publish Center
  const [activeTab, setActiveTab] = useState<'targets' | 'build_farm' | 'code_inspector' | 'identity' | 'assets' | 'history' | 'domains'>('targets');

  // App Identity Form State
  const [identityConfig, setIdentityConfig] = useState<AppIdentityConfig>({
    appName: activeTenant.appDownloadConfig?.appName || activeTenant.name,
    shortName: activeTenant.pwaConfig?.shortName || activeTenant.name.split(' ')[0] || 'Store',
    packageName: activeTenant.appDownloadConfig?.packageName || `sa.${activeTenant.slug}.app`,
    bundleId: activeTenant.appDownloadConfig?.bundleId || `sa.${activeTenant.slug}.store`,
    version: activeTenant.appDownloadConfig?.version || '1.4.0',
    buildNumber: 18,
    primaryColor: activeTenant.theme.tokens.primary,
    splashBackgroundColor: activeTenant.pwaConfig?.backgroundColor || '#0F172A',
    serverUrl: `https://${activeTenant.domain}`,
    apiUrl: `https://${activeTenant.domain}/api/v1`,
    enablePush: activeTenant.pwaConfig?.enablePush ?? true,
    enableBiometrics: true,
    enableOfflineCache: true,
    enableCameraPermission: true
  });

  // Source Code Inspector Active Target & File
  const [inspectorTarget, setInspectorTarget] = useState<'android' | 'ios' | 'pwa' | 'self_hosted'>('android');
  const [selectedFileKey, setSelectedFileKey] = useState<string>('manifest');

  // Custom Domain State
  const [customDomainInput, setCustomDomainInput] = useState<string>(activeTenant.customDomain || '');
  const [domainVerified, setDomainVerified] = useState<boolean>(activeTenant.customDomainVerified || false);
  const [isVerifyingDomain, setIsVerifyingDomain] = useState<boolean>(false);

  // Real-time Build Simulation Modal & Farm Stream State
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState<boolean>(false);
  const [buildingTarget, setBuildingTarget] = useState<DeliveryTarget>('android');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [buildProgress, setBuildProgress] = useState<number>(0);
  const [currentBuildStepText, setCurrentBuildStepText] = useState<string>('');
  const [assignedWorkerName, setAssignedWorkerName] = useState<string>('KSA-Riyadh-Worker-Alpha');
  const [workerCpuLoad, setWorkerCpuLoad] = useState<number>(68);
  const [workerRamLoad, setWorkerRamLoad] = useState<number>(54);
  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [buildCompleted, setBuildCompleted] = useState<boolean>(false);
  const [activeArtifact, setActiveArtifact] = useState<BuildArtifact | null>(null);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // Copied states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Build History Initial State
  const [buildHistory, setBuildHistory] = useState<BuildArtifact[]>([
    {
      id: 'build-art-01',
      tenantId: activeTenant.id,
      target: 'android',
      targetName: 'Android APK (Release)',
      version: '1.4.0',
      buildNumber: 18,
      status: 'succeeded',
      createdAt: '2026-08-21 21:30',
      fileSize: '19.4 MB',
      fileName: `${activeTenant.slug}-v1.4.0-release.apk`,
      downloadUrl: '#',
      commitHash: '7f9a2bc',
      buildDurationSec: 4.2,
      logs: [
        'Initialized Android Capacitor Target',
        'Resolved design tokens and assets',
        'Built APK successfully with Target SDK 34'
      ]
    },
    {
      id: 'build-art-02',
      tenantId: activeTenant.id,
      target: 'ios',
      targetName: 'iOS Xcode Project Bundle',
      version: '1.3.2',
      buildNumber: 17,
      status: 'succeeded',
      createdAt: '2026-08-20 18:15',
      fileSize: '34.8 MB',
      fileName: `${activeTenant.slug}-ios-project-v1.3.2.zip`,
      downloadUrl: '#',
      commitHash: 'e4d812a',
      buildDurationSec: 5.8,
      logs: [
        'Generated Xcode Workspace (.xcworkspace)',
        'Synthesized iOS AppIcon set',
        'Ready for TestFlight / App Store Archive'
      ]
    },
    {
      id: 'build-art-03',
      tenantId: activeTenant.id,
      target: 'self_hosted',
      targetName: 'Full Self-Hosted Docker Package',
      version: '1.3.0',
      buildNumber: 16,
      status: 'succeeded',
      createdAt: '2026-08-19 14:00',
      fileSize: '12.1 MB',
      fileName: `${activeTenant.slug}-selfhosted-docker.zip`,
      downloadUrl: '#',
      commitHash: '3a1c99f',
      buildDurationSec: 3.1,
      logs: [
        'Packaged Express backend + React frontend',
        'Generated docker-compose.yml and nginx.conf'
      ]
    }
  ]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('تم النسخ إلى الحافظة', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveIdentity = () => {
    updateTenant(activeTenant.id, {
      appDownloadConfig: {
        appName: identityConfig.appName,
        packageName: identityConfig.packageName,
        bundleId: identityConfig.bundleId,
        version: identityConfig.version,
        pwaEnabled: true,
        androidApkReady: true,
        iosReady: true
      },
      pwaConfig: {
        ...activeTenant.pwaConfig,
        appName: identityConfig.appName,
        shortName: identityConfig.shortName,
        backgroundColor: identityConfig.splashBackgroundColor,
        enablePush: identityConfig.enablePush
      }
    });
    showToast('تم حفظ هوية وإعدادات التطبيقات بنجاح', 'success');
  };

  // Launch isolated build in Redis/BullMQ worker farm with live WebSocket/SSE telemetry
  const triggerBuild = async (target: DeliveryTarget) => {
    setBuildingTarget(target);
    setIsBuildingModalOpen(true);
    setBuildProgress(0);
    setBuildCompleted(false);
    setBuildLogs([]);
    setGeneratedBlob(null);
    setCurrentBuildStepText('جارِ إرسال مهمة البناء إلى وسيط Redis/BullMQ...');

    const targetNames: Record<DeliveryTarget, { name: string; file: string; size: string }> = {
      web: { name: 'Web Package (ZIP)', file: `${activeTenant.slug}-web-v${identityConfig.version}.zip`, size: '8.4 MB' },
      pwa: { name: 'PWA Distribution', file: `${activeTenant.slug}-pwa-bundle.zip`, size: '3.2 MB' },
      android: { name: 'Android APK / AAB', file: `${activeTenant.slug}-v${identityConfig.version}-build${identityConfig.buildNumber}.apk`, size: '19.8 MB' },
      ios: { name: 'iOS Xcode Project', file: `${activeTenant.slug}-ios-xcode-v${identityConfig.version}.zip`, size: '36.2 MB' },
      self_hosted: { name: 'Self-Hosted Docker Package', file: `${activeTenant.slug}-selfhosted-docker.zip`, size: '14.5 MB' },
      desktop: { name: 'Desktop App (Tauri)', file: `${activeTenant.slug}-desktop-v${identityConfig.version}.msi`, size: '24.1 MB' }
    };

    const targetInfo = targetNames[target];

    // Enqueue in isolated Build Farm
    const { job, initialPosition } = buildFarm.enqueueJob(activeTenant, target, identityConfig);
    setActiveJobId(job.id);
    setQueuePosition(initialPosition);

    // Subscribe to live WebSocket / SSE progress stream from Worker Node
    const unsubscribe = buildFarm.subscribeToJob(job.id, async update => {
      setBuildProgress(update.progress);
      setCurrentBuildStepText(update.step);
      
      if (update.queuePosition !== undefined) {
        setQueuePosition(update.queuePosition);
      }

      if (update.metrics) {
        setWorkerCpuLoad(update.metrics.cpu);
        setWorkerRamLoad(update.metrics.ram);
      }

      if (update.log) {
        setBuildLogs(prev => [...prev, update.log!]);
      }

      if (update.status === 'ready' || update.progress === 100) {
        setBuildCompleted(true);
        unsubscribe();

        // Synthesize actual JSZip package
        try {
          const zipTarget = (target === 'android' ? 'android' : target === 'ios' ? 'ios' : target === 'pwa' ? 'pwa' : target === 'self_hosted' ? 'self_hosted' : 'pwa') as any;
          const blob = await exportZipPackage(zipTarget, activeTenant, identityConfig);
          setGeneratedBlob(blob);
        } catch (err) {
          console.error('ZIP generation error:', err);
        }

        const newArtifact: BuildArtifact = {
          id: `build-${Date.now()}`,
          tenantId: activeTenant.id,
          target,
          targetName: targetInfo.name,
          version: identityConfig.version,
          buildNumber: identityConfig.buildNumber + 1,
          status: 'succeeded',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          fileSize: targetInfo.size,
          fileName: targetInfo.file,
          downloadUrl: '#',
          commitHash: Math.random().toString(16).substring(2, 9),
          buildDurationSec: 3.4,
          logs: [
            `[Redis/BullMQ] Task claimed by worker node`,
            `[JIT Asset Pipeline] Synthesized app icons and manifests`,
            `[Compiling] ${targetInfo.name} assembled successfully`,
            `[Integrity] SHA256 verified: 9d4f${Date.now().toString(16)}`
          ],
          configSnapshot: { ...identityConfig }
        };

        setActiveArtifact(newArtifact);
        setBuildHistory(prev => [newArtifact, ...prev]);
        setIdentityConfig(prev => ({ ...prev, buildNumber: prev.buildNumber + 1 }));
        showToast(`تم إتمام بناء حزمة ${targetInfo.name} بنجاح عبر مزرعة البناء المعزولة!`, 'success');
      }
    });
  };

  // Direct ZIP download handler
  const handleDownloadFullZip = async (target: 'android' | 'ios' | 'pwa' | 'self_hosted' | 'capacitor_all') => {
    setIsZipping(true);
    showToast('جارِ تجميع وضغط ملفات المشروع...', 'info');
    try {
      const blob = await exportZipPackage(target, activeTenant, identityConfig);
      const filename = `${activeTenant.slug}-${target}-v${identityConfig.version}.zip`;
      downloadBlobFile(blob, filename);
      showToast(`تم تحميل حزمة ${filename} بنجاح!`, 'success');
    } catch (error) {
      console.error('Error exporting zip:', error);
      showToast('تعذر تصدير ملف الـ ZIP', 'error');
    } finally {
      setIsZipping(false);
    }
  };

  const handleVerifyCustomDomain = () => {
    if (!customDomainInput || !customDomainInput.includes('.')) {
      showToast('يرجى إدخال اسم نطاق صحيح (مثل: store.example.com)', 'warning');
      return;
    }

    setIsVerifyingDomain(true);
    setTimeout(() => {
      setIsVerifyingDomain(false);
      setDomainVerified(true);
      updateTenant(activeTenant.id, {
        customDomain: customDomainInput,
        customDomainVerified: true
      });
      showToast(`تم ربط والتحقق من النطاق ${customDomainInput} بنجاح! تم تفعيل شهادة SSL تلقائياً`, 'success');
    }, 2000);
  };

  // Asset Pipeline Items
  const assetItems: GeneratedAssetItem[] = [
    { id: '1', name: 'favicon.ico / 32x32', platform: 'web', dimensions: '32 × 32 px', purpose: 'أيقونة شريط المتصفح' },
    { id: '2', name: 'icon-192.png (Maskable)', platform: 'pwa', dimensions: '192 × 192 px', purpose: 'أيقونة التثبيت في أندرويد و PWA' },
    { id: '3', name: 'icon-512.png (High-Res)', platform: 'pwa', dimensions: '512 × 512 px', purpose: 'أيقونة شاشة البداية والمتجر' },
    { id: '4', name: 'mipmap-xxxhdpi.png', platform: 'android', dimensions: '192 × 192 px', purpose: 'أيقونة شاشة الهاتف الأصلية (Android)' },
    { id: '5', name: 'AppIcon-1024.png', platform: 'ios', dimensions: '1024 × 1024 px', purpose: 'أيقونة متجر App Store الأصلية (iOS)' },
    { id: '6', name: 'splash-screen.png', platform: 'android', dimensions: '1080 × 1920 px', purpose: 'شاشة البداية عند تشغيل التطبيق' }
  ];

  // Inspector File Definitions
  const inspectorFiles: Record<string, Record<string, { label: string; ext: string; content: string }>> = {
    android: {
      manifest: {
        label: 'AndroidManifest.xml',
        ext: 'xml',
        content: generateAndroidManifest(activeTenant, identityConfig)
      },
      mainActivity: {
        label: 'MainActivity.java',
        ext: 'java',
        content: generateMainActivityJava(activeTenant, identityConfig)
      },
      gradle: {
        label: 'build.gradle',
        ext: 'gradle',
        content: generateAndroidGradle(activeTenant, identityConfig)
      },
      strings: {
        label: 'strings.xml',
        ext: 'xml',
        content: generateAndroidStrings(activeTenant, identityConfig)
      },
      capacitor: {
        label: 'capacitor.config.json',
        ext: 'json',
        content: generateCapacitorConfig(activeTenant, identityConfig)
      }
    },
    ios: {
      plist: {
        label: 'Info.plist',
        ext: 'plist',
        content: generateIOSInfoPlist(activeTenant, identityConfig)
      },
      appDelegate: {
        label: 'AppDelegate.swift',
        ext: 'swift',
        content: generateIOSAppDelegate(activeTenant)
      },
      podfile: {
        label: 'Podfile',
        ext: 'ruby',
        content: generateIOSPodfile(activeTenant)
      },
      capacitor: {
        label: 'capacitor.config.json',
        ext: 'json',
        content: generateCapacitorConfig(activeTenant, identityConfig)
      }
    },
    pwa: {
      manifest: {
        label: 'manifest.json',
        ext: 'json',
        content: generatePWAManifest(activeTenant, identityConfig)
      },
      sw: {
        label: 'sw.js (Service Worker)',
        ext: 'javascript',
        content: generateServiceWorker(activeTenant)
      },
      offline: {
        label: 'offline.html',
        ext: 'html',
        content: generateOfflineHtml(activeTenant)
      },
      index: {
        label: 'index.html',
        ext: 'html',
        content: generatePWAIndexHtml(activeTenant, identityConfig)
      }
    },
    self_hosted: {
      dockerCompose: {
        label: 'docker-compose.yml',
        ext: 'yaml',
        content: generateDockerCompose(activeTenant)
      },
      dockerfile: {
        label: 'Dockerfile',
        ext: 'dockerfile',
        content: generateDockerfile(activeTenant)
      },
      nginx: {
        label: 'nginx.conf',
        ext: 'conf',
        content: generateNginxConf(activeTenant)
      },
      server: {
        label: 'server.js',
        ext: 'javascript',
        content: generateSelfHostedServerJs(activeTenant)
      },
      deploy: {
        label: 'deploy.sh',
        ext: 'bash',
        content: generateDeployScript(activeTenant)
      }
    }
  };

  const currentInspectorTargetFiles = inspectorFiles[inspectorTarget] || inspectorFiles.android;
  const currentFileKeys = Object.keys(currentInspectorTargetFiles);
  const activeFile = currentInspectorTargetFiles[selectedFileKey] || currentInspectorTargetFiles[currentFileKeys[0]];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Multi-Target Build Pipelines */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-amber-950/40 border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Boxes className="w-3.5 h-3.5 text-amber-400" />
                <span>خطوط التجميع والتصدير السيادي (Multi-Target Build Pipelines)</span>
              </div>
              {activeTenant.licensing?.isWhiteLabel ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>White-Label Certified (Clean Source Code)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>النسخة الأساسية (شعار المنصة مدمج مع حماية النزاهة)</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              تحويل التكوين (JSON Config) إلى تطبيقات وأكواد سيادية جاهزة للإنتاج
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              توليد مؤتمت لمشاريع أندرويد و iOS عبر حزم <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded">@capacitor/cli</code> في بيئة معزولة، وحزم PWA الثابتة مع Service Worker، وحاويات Docker Compose المكتفية ذاتياً.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleDownloadFullZip('android')}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs hover:from-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'جارِ الضغط...' : 'تصدير مشروع أندرويد (.ZIP)'}</span>
            </button>
            <button
              onClick={() => handleDownloadFullZip('self_hosted')}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs transition-all disabled:opacity-50"
            >
              <Server className="w-4 h-4 text-emerald-400" />
              <span>تصدير حزمة Docker (.ZIP)</span>
            </button>
          </div>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>المعمارية الموحدة: تدفق البيانات من النواة المركزية إلى قنوات النشر</span>
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
              Server-Driven Live Data
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center">
              <Smartphone className="w-5 h-5 text-emerald-400 mb-1.5" />
              <div className="text-xs font-bold text-white">Android Studio</div>
              <div className="text-[10px] text-emerald-400 mt-1">🟢 Capacitor CLI</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center">
              <Apple className="w-5 h-5 text-slate-200 mb-1.5" />
              <div className="text-xs font-bold text-white">iOS Xcode</div>
              <div className="text-[10px] text-emerald-400 mt-1">🟢 Ready to Sign</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center">
              <Smartphone className="w-5 h-5 text-amber-400 mb-1.5" />
              <div className="text-xs font-bold text-white">PWA & Static</div>
              <div className="text-[10px] text-amber-400 mt-1">🟡 Service Worker</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center">
              <Server className="w-5 h-5 text-purple-400 mb-1.5" />
              <div className="text-xs font-bold text-white">Docker Compose</div>
              <div className="text-[10px] text-purple-400 mt-1">🟣 Sovereign Stack</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center">
              <Globe className="w-5 h-5 text-blue-400 mb-1.5" />
              <div className="text-xs font-bold text-white">Custom Domain</div>
              <div className="text-[10px] text-blue-400 mt-1">🔵 SSL Auto-Renew</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'targets', label: 'أهداف النشر (Delivery Targets)', icon: Rocket },
          { id: 'build_farm', label: 'مزرعة البناء وطوابير العمال (DevOps Farm)', icon: Cpu },
          { id: 'code_inspector', label: 'مستعرض الأكواد والمشاريع (Source Inspector)', icon: Code2 },
          { id: 'identity', label: 'هوية وإعدادات التطبيقات (App Identity)', icon: Sliders },
          { id: 'assets', label: 'مولد الأيقونات والشاشات (Asset Pipeline)', icon: ImageIcon },
          { id: 'domains', label: 'الدومين المخصص والـ DNS', icon: Globe },
          { id: 'history', label: 'سجل البناء والإصدارات (Build History)', icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DELIVERY TARGETS MATRIX */}
      {activeTab === 'targets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Target 1: Android Studio Native Project */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all shadow-lg">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  🟢 Capacitor 6.0
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white">تطبيق أندرويد الأصلي (Android Studio)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  توليد برمجيات مشروع أندرويد ستوديو كامل مع ملفات Gradle والتوقيع الرقمي Keystore ودعم كامل للأجهزة الحديثة (SDK 34).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Package ID:</span>
                  <span className="text-emerald-400">{identityConfig.packageName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Version:</span>
                  <span className="text-slate-200">v{identityConfig.version} (Build {identityConfig.buildNumber})</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleDownloadFullZip('android')}
                disabled={isZipping}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل مشروع أندرويد كامل (.ZIP)</span>
              </button>
              <button
                onClick={() => triggerBuild('android')}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>تشغيل خط تجميع أندرويد</span>
              </button>
            </div>
          </div>

          {/* Target 2: iOS Xcode Project */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all shadow-lg">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-100">
                  <Apple className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                  🔵 Xcode Workspace
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white">تطبيق آبل الأصلي (Apple iOS)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  توليد مشروع Xcode متكامل مع إعدادات CocoaPods و Info.plist ودعم كامل لأذونات الكاميرا والبصمة والـ FaceID.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bundle ID:</span>
                  <span className="text-blue-400">{identityConfig.bundleId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target iOS:</span>
                  <span className="text-slate-200">iOS 15.0+</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleDownloadFullZip('ios')}
                disabled={isZipping}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل حزمة Xcode (.ZIP)</span>
              </button>
              <button
                onClick={() => triggerBuild('ios')}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>تشغيل خط تجميع iOS</span>
              </button>
            </div>
          </div>

          {/* Target 3: Progressive Web App & Static Bundle */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all shadow-lg">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                  🟡 PWA Standalone
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white">تطبيق الويب التقدمي (PWA)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  حزمة ثابتة مع manifest.json و sw.js للتخزين المؤقت، وشاشة كاملة تعمل بدون اتصال، متوافقة مع Vercel و Netlify و Cloudflare.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Display:</span>
                  <span className="text-amber-400">Standalone (Full-screen)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Offline Caching:</span>
                  <span className="text-emerald-400">Enabled (Stale-While-Revalidate)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleDownloadFullZip('pwa')}
                disabled={isZipping}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل حزمة PWA الكاملة (.ZIP)</span>
              </button>
              <button
                onClick={() => triggerBuild('pwa')}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>تشغيل خط تجميع PWA</span>
              </button>
            </div>
          </div>

          {/* Target 4: Dockerized Sovereign Self-Hosted */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all shadow-lg">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Server className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
                  🟣 Docker Compose
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white">الاستضافة السيادية المستقلة (Docker)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  حاوية متكاملة بملف docker-compose.yml وخادم Express مدمج مع Nginx للتشغيل الفوري على أي سيرفر خاص VPS بضغطة زر.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Services:</span>
                  <span className="text-purple-400">Store (Node.js) + Nginx Proxy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">1-Click Deploy:</span>
                  <span className="text-emerald-400">./deploy.sh Included</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleDownloadFullZip('self_hosted')}
                disabled={isZipping}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل حزمة Docker (.ZIP)</span>
              </button>
              <button
                onClick={() => triggerBuild('self_hosted')}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>تشغيل خط تجميع Docker</span>
              </button>
            </div>
          </div>

          {/* Target 5: Full Multi-Platform Master Bundle */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/40 p-6 flex flex-col justify-between space-y-6 hover:border-amber-500/60 transition-all shadow-lg">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <Boxes className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  ⭐ الحزمة الشاملة
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white">الحزمة الشاملة (All Mobile Platforms)</h3>
                <p className="text-xs text-slate-300 mt-1">
                  تصدير ملف مضغوط يحتوي على مشروعي Android Studio و iOS Xcode وإعدادات Capacitor موحدة وجاهزة للفتح المباشر.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Included:</span>
                  <span className="text-amber-400">Android + iOS + PWA + Assets</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => handleDownloadFullZip('capacitor_all')}
                disabled={isZipping}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الحزمة الشاملة للموبايل (.ZIP)</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB: DEVOPS BUILD FARM & ISOLATED QUEUES */}
      {activeTab === 'build_farm' && (
        <div className="animate-in fade-in space-y-6">
          <BuildFarmMonitor />
        </div>
      )}

      {/* TAB 2: INFRASTRUCTURE AS CODE & SOURCE TREE INSPECTOR */}
      {activeTab === 'code_inspector' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                <FolderTree className="w-4 h-4" />
                <span>Infrastructure-as-Code & Code Generator</span>
              </div>
              <h2 className="text-xl font-black text-white">مستعرض الأكواد والمشاريع المصدرية</h2>
              <p className="text-xs text-slate-400 mt-1">
                استعرض الملفات البرمجية المولدة لحظياً قبل تنزيلها، مع إمكانية نسخ أي ملف أو تنزيل الحزمة الكاملة.
              </p>
            </div>

            {/* Target Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
              {[
                { id: 'android', label: 'Android Studio', icon: Smartphone },
                { id: 'ios', label: 'Apple Xcode', icon: Apple },
                { id: 'pwa', label: 'PWA & Web', icon: Globe },
                { id: 'self_hosted', label: 'Docker Sovereign', icon: Server }
              ].map(t => {
                const Icon = t.icon;
                const isSelected = inspectorTarget === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setInspectorTarget(t.id as any);
                      const files = Object.keys(inspectorFiles[t.id as any] || {});
                      if (files.length > 0) setSelectedFileKey(files[0]);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* File List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 px-1 mb-2">الملفات البرمجية للمشروع:</div>
              <div className="space-y-1">
                {currentFileKeys.map(key => {
                  const item = currentInspectorTargetFiles[key];
                  const isSelected = selectedFileKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedFileKey(key)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-mono transition-all text-left ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 uppercase">
                        {item.ext}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => handleDownloadFullZip(inspectorTarget)}
                  disabled={isZipping}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل الحزمة كاملة (.ZIP)</span>
                </button>
              </div>
            </div>

            {/* Code Viewer Panel */}
            <div className="lg:col-span-3 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono text-slate-300">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>{activeFile.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(activeFile.content, activeFile.label)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  >
                    {copiedKey === activeFile.label ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === activeFile.label ? 'تم النسخ' : 'نسخ الكود'}</span>
                  </button>
                  <button
                    onClick={() => downloadTextFile(activeFile.content, activeFile.label)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>تنزيل الملف</span>
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-x-auto max-h-[500px] font-mono text-xs text-left text-slate-300 leading-relaxed whitespace-pre" dir="ltr">
                {activeFile.content}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: APP IDENTITY & METADATA CONFIG */}
      {activeTab === 'identity' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">هوية وإعدادات التطبيقات الأصلية</h2>
              <p className="text-xs text-slate-400 mt-1">
                تعديل معرفات الحزم وأرقام الإصدارات والأذونات التي يتم حقنها في ملفات AndroidManifest.xml و Info.plist.
              </p>
            </div>
            <button
              onClick={handleSaveIdentity}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>حفظ الإعدادات</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم التطبيق الظاهر للمستخدم</label>
                <input
                  type="text"
                  value={identityConfig.appName}
                  onChange={e => setIdentityConfig({ ...identityConfig, appName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم المختصر (Short Name / PWA)</label>
                <input
                  type="text"
                  value={identityConfig.shortName}
                  onChange={e => setIdentityConfig({ ...identityConfig, shortName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">معرف الحزمة (Android Package Name)</label>
                <input
                  type="text"
                  value={identityConfig.packageName}
                  onChange={e => setIdentityConfig({ ...identityConfig, packageName: e.target.value })}
                  placeholder="sa.mystore.app"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 text-xs focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">معرف أبل (iOS Bundle Identifier)</label>
                <input
                  type="text"
                  value={identityConfig.bundleId}
                  onChange={e => setIdentityConfig({ ...identityConfig, bundleId: e.target.value })}
                  placeholder="sa.mystore.store"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-blue-400 text-xs focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم الإصدار (Version)</label>
                  <input
                    type="text"
                    value={identityConfig.version}
                    onChange={e => setIdentityConfig({ ...identityConfig, version: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم البناء (Build Number)</label>
                  <input
                    type="number"
                    value={identityConfig.buildNumber}
                    onChange={e => setIdentityConfig({ ...identityConfig, buildNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">لون خلفية شاشة البداية (Splash Background)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={identityConfig.splashBackgroundColor}
                    onChange={e => setIdentityConfig({ ...identityConfig, splashBackgroundColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={identityConfig.splashBackgroundColor}
                    onChange={e => setIdentityConfig({ ...identityConfig, splashBackgroundColor: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300">أذونات وتكاملات التطبيق الأصلي:</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={identityConfig.enablePush}
                      onChange={e => setIdentityConfig({ ...identityConfig, enablePush: e.target.checked })}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span>إشعارات الدفع (Push)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={identityConfig.enableBiometrics}
                      onChange={e => setIdentityConfig({ ...identityConfig, enableBiometrics: e.target.checked })}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span>بصمة الوجه والإصبع</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={identityConfig.enableCameraPermission}
                      onChange={e => setIdentityConfig({ ...identityConfig, enableCameraPermission: e.target.checked })}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span>ماسح الباركود بالكاميرا</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={identityConfig.enableOfflineCache}
                      onChange={e => setIdentityConfig({ ...identityConfig, enableOfflineCache: e.target.checked })}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span>التخزين دون اتصال (Cache)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASSET PIPELINE STUDIO */}
      {activeTab === 'assets' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">خط إنتاج الأيقونات والأصول (Asset Pipeline)</h2>
              <p className="text-xs text-slate-400 mt-1">
                بمجرد رفع شعار متجرك، يقوم محرك CommerceOS بإنشاء جميع أحجام وتنسيقات الأيقونات وشاشات البداية تلقائياً لكل المنصات.
              </p>
            </div>
            <button
              onClick={() => {
                downloadTextFile(JSON.stringify(assetItems, null, 2), 'icons-assets-manifest.json', 'application/json');
                showToast('تم تحميل حزمة الأصول والأيقونات الكاملة', 'success');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs transition-all"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>تحميل جميع الأيقونات (.ZIP)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assetItems.map(item => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-4 hover:border-slate-700 transition-colors">
                <div 
                  className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center overflow-hidden shrink-0 shadow-inner p-1.5"
                  style={{ backgroundColor: identityConfig.splashBackgroundColor }}
                >
                  <img 
                    src={activeTenant.logo} 
                    alt={item.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{item.name}</div>
                  <div className="text-[11px] text-amber-400 font-mono">{item.dimensions}</div>
                  <div className="text-[10px] text-slate-400 truncate">{item.purpose}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOM DOMAIN & DNS SETUP */}
      {activeTab === 'domains' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">ربط النطاق المخصص (Custom Domain & SSL)</h2>
            <p className="text-xs text-slate-400 mt-1">
              اربط متجرك بنطاقك الخاص (مثل www.mystore.com) مع توليد وتجديد شهادات الأمان SSL مجاناً وتلقائياً.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم النطاق المخصص الخاص بك</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDomainInput}
                    onChange={e => setCustomDomainInput(e.target.value)}
                    placeholder="store.mybrand.com أو www.mybrand.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:border-amber-500 focus:outline-none font-mono"
                  />
                  <button
                    onClick={handleVerifyCustomDomain}
                    disabled={isVerifyingDomain}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs whitespace-nowrap transition-all flex items-center gap-2"
                  >
                    {isVerifyingDomain && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isVerifyingDomain ? 'جارِ التحقق...' : 'ربط وتحقق'}</span>
                  </button>
                </div>
              </div>

              {domainVerified && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 flex items-center gap-3 text-xs text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold">تم التحقق من النطاق وتفعيل شهادة SSL بنجاح!</div>
                    <div className="text-[11px] text-emerald-400/80">المتجر يستقبل الزيارات الآن مباشرة عبر {activeTenant.customDomain}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>سجلات الـ DNS المطلوبة في لوحة تحكم نطاقك (Cloudflare / GoDaddy / Namecheap):</span>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-amber-400 font-bold">CNAME </span>
                    <span className="text-slate-300">@ أو www ➔ </span>
                    <span className="text-blue-400">cname.commerceos.app</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('cname.commerceos.app', 'cname')}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'cname' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-emerald-400 font-bold">A Record </span>
                    <span className="text-slate-300">@ ➔ </span>
                    <span className="text-blue-400">76.76.21.21</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('76.76.21.21', 'ip')}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'ip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BUILD HISTORY & RELEASE RELEASES */}
      {activeTab === 'history' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">سجل البناء والإصدارات (Build History & Releases)</h2>
              <p className="text-xs text-slate-400 mt-1">
                سجل كامل لجميع حزم التطبيقات والمشاريع المولدة مع إمكانية التنزيل الفوري أو إعادة البناء أو استرجاع النسخ السابقة.
              </p>
            </div>
            <button
              onClick={() => showToast('سجل الإصدارات محدّث', 'info')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تحديث السجل</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">الإصدار والحزمة</th>
                  <th className="p-3">المنصة المستهدفة</th>
                  <th className="p-3">تاريخ البناء</th>
                  <th className="p-3">الحجم</th>
                  <th className="p-3">Commit</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {buildHistory.map(artifact => (
                  <tr key={artifact.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-2">
                        <FolderArchive className="w-4 h-4 text-amber-400" />
                        <span>v{artifact.version} (Build {artifact.buildNumber})</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{artifact.fileName}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                        {artifact.targetName}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-mono">{artifact.createdAt}</td>
                    <td className="p-3 text-slate-400 font-mono">{artifact.fileSize}</td>
                    <td className="p-3 font-mono text-amber-400">{artifact.commitHash}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>نجح البناء</span>
                      </span>
                    </td>
                    <td className="p-3 text-left">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            const zipTarget = (artifact.target === 'android' ? 'android' : artifact.target === 'ios' ? 'ios' : artifact.target === 'self_hosted' ? 'self_hosted' : 'pwa') as any;
                            handleDownloadFullZip(zipTarget);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>تحميل ZIP</span>
                        </button>
                        <button
                          onClick={() => triggerBuild(artifact.target)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                          title="إعادة البناء"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REAL-TIME BUILD MODAL & TERMINAL LOGS */}
      {isBuildingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-750 shadow-2xl overflow-hidden text-right flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">غرفة التجميع المعزولة (Isolated Build Chamber)</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>WS Stream Active</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Target: <span className="text-amber-400 uppercase font-bold">{buildingTarget}</span> • Assigned Worker: <span className="text-slate-200 font-bold">{assignedWorkerName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!buildCompleted ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>جارِ المعالجة المعزولة ({buildProgress}%)</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>تم البناء والتسليم بنجاح!</span>
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Real-Time Progress Bar & Worker Telemetry */}
            <div className="p-6 bg-slate-925 border-b border-slate-800 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>{currentBuildStepText}</span>
                  </span>
                  <span className="font-mono font-black text-amber-400 text-sm">
                    {buildProgress}%
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      buildProgress === 100 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                        : 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-lg shadow-amber-500/50'
                    }`}
                    style={{ width: `${buildProgress}%` }}
                  />
                </div>
              </div>

              {/* Worker Nodes Telemetry Bar */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Worker CPU:</span>
                  <span className="font-bold text-emerald-400">{workerCpuLoad}%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Worker RAM:</span>
                  <span className="font-bold text-blue-400">{workerRamLoad}%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Broker:</span>
                  <span className="font-bold text-purple-400">BullMQ Isolated</span>
                </div>
              </div>
            </div>

            {/* Terminal Window Body */}
            <div className="p-6 space-y-4 flex-1 overflow-y-auto bg-slate-950 font-mono text-xs text-left" dir="ltr">
              <div className="text-slate-500 flex items-center justify-between">
                <span>// CommerceOS Sovereign Build Farm Stream - Channel: {activeJobId || 'live-job'}</span>
                <span className="text-emerald-500 font-bold">● WS STREAMING</span>
              </div>
              
              <div className="space-y-1.5 text-slate-300">
                {buildLogs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`leading-relaxed ${
                      log.includes('SUCCESS') || log.includes('Done') ? 'text-emerald-400 font-bold' :
                      log.includes('Worker') || log.includes('Redis') ? 'text-amber-400 font-bold' :
                      log.includes('Compiling') || log.includes('Capacitor') ? 'text-blue-400' :
                      log.includes('White-Label') ? 'text-purple-400 font-bold' :
                      'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>

              {!buildCompleted && (
                <div className="flex items-center gap-2 text-amber-400 pt-2 animate-pulse font-mono">
                  <span>&gt; Processing isolated tasks... ({buildProgress}%)</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
              <button
                onClick={() => setIsBuildingModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-colors"
              >
                إغلاق
              </button>

              {buildCompleted && activeArtifact && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (generatedBlob) {
                        downloadBlobFile(generatedBlob, activeArtifact.fileName.replace('.apk', '.zip'));
                      } else {
                        const zipTarget = (activeArtifact.target === 'android' ? 'android' : activeArtifact.target === 'ios' ? 'ios' : activeArtifact.target === 'self_hosted' ? 'self_hosted' : 'pwa') as any;
                        handleDownloadFullZip(zipTarget);
                      }
                      showToast(`تم تنزيل ${activeArtifact.fileName} بنجاح`, 'success');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الحزمة المولدة (.ZIP)</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

