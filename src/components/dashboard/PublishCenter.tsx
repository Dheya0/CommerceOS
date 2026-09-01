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
  RefreshCw, 
  ShieldCheck, 
  Sliders, 
  History, 
  Code2,
  FolderArchive,
  Zap,
  Activity,
  CheckCheck
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { exportZipPackage, downloadBlobFile } from '../../utils/exportEngine';

interface ArtifactItem {
  id: string;
  buildId?: string;
  projectId?: string;
  target: string;
  targetName: string;
  version: string;
  buildNumber: number;
  fileName: string;
  fileSizeMb?: string;
  checksum?: string;
  createdAt: string;
  status: string;
}

export const PublishCenter: React.FC = () => {
  const { activeTenant, showToast, language, authToken } = useCommerce();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'targets' | 'artifacts' | 'deploy_guides' | 'identity'>('targets');

  // App Identity Form State
  const [identityConfig, setIdentityConfig] = useState({
    appName: activeTenant.name || 'My Commerce App',
    shortName: activeTenant.slug || 'Store',
    packageName: `sa.${activeTenant.slug || 'store'}.app`,
    bundleId: `sa.${activeTenant.slug || 'store'}.store`,
    version: '1.0.0',
    buildNumber: 1,
    primaryColor: activeTenant.theme?.tokens?.primary || '#C9A45C',
    serverUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3000/api/v1'
  });

  // State for backend builds
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [loadingArtifacts, setLoadingArtifacts] = useState<boolean>(false);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [currentBuildStep, setCurrentBuildStep] = useState<string>('');
  const [buildProgress, setBuildProgress] = useState<number>(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [activeBuildingTarget, setActiveBuildingTarget] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Fetch real artifacts from backend
  const fetchArtifacts = async () => {
    setLoadingArtifacts(true);
    try {
      const res = await fetch('/api/v1/builds/artifacts/list', {
        headers: {
          'Authorization': `Bearer ${authToken || localStorage.getItem('cos_auth_token') || ''}`,
          'X-Tenant-ID': activeTenant.id
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.artifacts)) {
          setArtifacts(data.artifacts);
        }
      }
    } catch (err) {
      console.warn('Could not fetch artifacts list:', err);
    } finally {
      setLoadingArtifacts(false);
    }
  };

  useEffect(() => {
    fetchArtifacts();
  }, [activeTenant.id]);

  // Trigger Build Pipeline
  const handleTriggerBuild = async (target: string, targetName: string) => {
    setIsBuilding(true);
    setActiveBuildingTarget(target);
    setBuildProgress(10);
    setCurrentBuildStep(isAr ? 'بدء إرسال طلب البناء إلى Code Factory...' : 'Submitting build job to Code Factory...');
    setBuildLogs([`[${new Date().toISOString()}] Initiating build for target: ${target}`]);

    try {
      const res = await fetch('/api/v1/builds/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || localStorage.getItem('cos_auth_token') || ''}`,
          'X-Tenant-ID': activeTenant.id
        },
        body: JSON.stringify({
          target,
          version: identityConfig.version
        })
      });

      if (!res.ok) {
        throw new Error('Failed to trigger build on server');
      }

      const data = await res.json();
      const buildId = data.build?.id;

      // Poll build status
      if (buildId) {
        let attempts = 0;
        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const statusRes = await fetch(`/api/v1/builds/${buildId}`, {
              headers: {
                'Authorization': `Bearer ${authToken || localStorage.getItem('cos_auth_token') || ''}`,
                'X-Tenant-ID': activeTenant.id
              }
            });
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              const b = statusData.build;
              if (b) {
                setBuildProgress(b.progress || 50);
                setCurrentBuildStep(b.currentStep || 'Processing...');
                if (Array.isArray(b.logs)) {
                  setBuildLogs(b.logs);
                }

                if (b.status === 'completed') {
                  clearInterval(pollInterval);
                  setIsBuilding(false);
                  showToast(isAr ? `اكتمل بناء حزمة ${targetName} بنجاح!` : `Build completed successfully!`, 'success');
                  fetchArtifacts();
                } else if (b.status === 'failed') {
                  clearInterval(pollInterval);
                  setIsBuilding(false);
                  showToast(isAr ? `فشل بناء الحزمة: ${b.error || ''}` : `Build failed`, 'error');
                }
              }
            }
          } catch (e) {
            console.error('Polling error:', e);
          }

          if (attempts > 30) {
            clearInterval(pollInterval);
            setIsBuilding(false);
            fetchArtifacts();
          }
        }, 1200);
      }
    } catch (err: any) {
      console.warn('Backend build trigger fallback to client export:', err);
      // Client-side fallback compilation
      try {
        setBuildProgress(40);
        setCurrentBuildStep(isAr ? 'تجميع الملفات والمكونات محلياً...' : 'Bundling package client-side...');
        const zipTarget = (target === 'android' ? 'android' : target === 'ios' ? 'ios' : target === 'pwa' ? 'pwa' : target === 'docker' ? 'self_hosted' : 'self_hosted') as any;
        const blob = await exportZipPackage(zipTarget, activeTenant, identityConfig as any);
        setBuildProgress(100);
        const fileName = `${activeTenant.slug}-${target}-v${identityConfig.version}.zip`;
        downloadBlobFile(blob, fileName);
        setIsBuilding(false);
        showToast(isAr ? `تم تصدير حزمة ${fileName} بنجاح!` : `Package ${fileName} exported!`, 'success');
      } catch (clientErr) {
        setIsBuilding(false);
        showToast(isAr ? 'حدث خطأ أثناء تصدير الحزمة' : 'Export failed', 'error');
      }
    }
  };

  // Direct Download
  const handleDownloadArtifact = async (artifact: ArtifactItem) => {
    showToast(isAr ? 'جارِ تنزيل الحزمة الموثقة...' : 'Downloading verified package...', 'info');
    try {
      const downloadUrl = `/api/v1/builds/download/${artifact.id}`;
      const res = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${authToken || localStorage.getItem('cos_auth_token') || ''}`,
          'X-Tenant-ID': activeTenant.id
        }
      });
      if (!res.ok) throw new Error('Download request rejected');
      const blob = await res.blob();
      downloadBlobFile(blob, artifact.fileName);
      showToast(isAr ? `تم تنزيل ${artifact.fileName} بنجاح!` : 'Download complete!', 'success');
    } catch (e) {
      // Fallback
      handleTriggerBuild(artifact.target, artifact.targetName);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
    showToast(isAr ? 'تم النسخ إلى الحافظة' : 'Copied to clipboard', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER BANNER */}
      <div className="p-8 rounded-3xl bg-[#0B1422] border border-[#233247] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/10 border border-[#C9A45C]/30 text-[#C9A45C] text-xs font-bold mb-3">
              <Code2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'مصنع الأكواد وحزم النشر السيادية' : 'Code Factory & Full-Stack Generator'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isAr ? 'البناء والتصدير (Build & Export)' : 'Build & Export Pipeline'}
            </h1>
            <p className="text-sm text-[#97A4B5] mt-2 max-w-2xl leading-relaxed">
              {isAr 
                ? 'قم بتوليد وتنزيل الكود المصدري الكامل لمشروعك (Frontend, Backend, Database, Android, iOS, Docker) مع التوقيع الرقمي وبصمة SHA-256، وانشر على سيرفرك الخاص بحرية تامة.'
                : 'Generate and export full-stack source code, mobile app projects, and self-hosted bundles with SHA-256 integrity verification. Deploy anywhere.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTriggerBuild('full_stack', 'Full-Stack Sovereign Stack')}
              disabled={isBuilding}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-black text-xs hover:opacity-95 shadow-lg shadow-[#C9A45C]/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Rocket className="w-4 h-4" />
              <span>{isAr ? 'توليد الحزمة الكاملة (Full-Stack .ZIP)' : 'Generate Full-Stack (.ZIP)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB TABS */}
      <div className="flex items-center gap-2 border-b border-[#233247] pb-3 overflow-x-auto">
        {[
          { id: 'targets', label: isAr ? 'أهداف النشر والتصدير' : 'Delivery Targets', icon: Rocket },
          { id: 'artifacts', label: isAr ? `الحزم المولدة (${artifacts.length})` : `Artifacts (${artifacts.length})`, icon: FolderArchive },
          { id: 'deploy_guides', label: isAr ? 'أدلة النشر الذاتي (VPS / Docker)' : 'Deployment Guides', icon: Terminal },
          { id: 'identity', label: isAr ? 'هوية الحزم والإصدارات' : 'Identity & Versions', icon: Sliders }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-[#C9A45C] text-[#050B14] shadow-md shadow-[#C9A45C]/20' 
                  : 'text-[#97A4B5] hover:text-white hover:bg-[#101B2C]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE BUILD PROGRESS CARD */}
      {isBuilding && (
        <div className="p-6 rounded-3xl bg-[#101B2C] border border-[#C9A45C]/40 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A45C]/10 border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C] animate-spin">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {isAr ? 'خط البناء نشط حالياً...' : 'Build Pipeline Active...'} ({activeBuildingTarget})
                </div>
                <div className="text-xs text-[#97A4B5] mt-0.5">{currentBuildStep}</div>
              </div>
            </div>
            <div className="text-lg font-black text-[#C9A45C] font-mono">{buildProgress}%</div>
          </div>

          <div className="w-full bg-[#050B14] rounded-full h-2 overflow-hidden border border-[#233247]">
            <div 
              className="bg-gradient-to-r from-[#C9A45C] to-[#E0C078] h-full transition-all duration-300 rounded-full"
              style={{ width: `${buildProgress}%` }}
            />
          </div>

          {buildLogs.length > 0 && (
            <div className="p-3 rounded-xl bg-[#050B14] border border-[#233247] font-mono text-[11px] text-[#97A4B5] space-y-1 max-h-32 overflow-y-auto">
              {buildLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">{log}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: TARGETS */}
      {activeTab === 'targets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Target 1: Full-Stack Project */}
          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] flex flex-col justify-between space-y-6 hover:border-[#C9A45C]/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#C9A45C]/10 border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C]">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#C9A45C]/10 text-[#C9A45C] border border-[#C9A45C]/20 text-[11px] font-bold">
                  Sovereign Full-Stack
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'حزمة المشروع الكاملة (Full-Stack)' : 'Full-Stack Sovereign Codebase'}
                </h3>
                <p className="text-xs text-[#97A4B5] mt-1.5 leading-relaxed">
                  {isAr
                    ? 'مشروع كامل يحتوي على Frontend (React SPA) و Backend (Express API) ومخططات قواعد البيانات (PostgreSQL/Drizzle) وملفات Docker و Nginx.'
                    : 'Complete self-contained project with React 18 frontend, Express API backend, PostgreSQL database schema, and Docker config.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#233247]">
              <button
                onClick={() => handleTriggerBuild('full_stack', 'Full-Stack Sovereign Stack')}
                disabled={isBuilding}
                className="w-full py-3 rounded-2xl bg-[#C9A45C] hover:bg-[#E0C078] text-[#050B14] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#C9A45C]/20 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isAr ? 'توليد وتنزيل كود المشروع (.ZIP)' : 'Generate & Export Project'}</span>
              </button>
            </div>
          </div>

          {/* Target 2: Android Studio Project */}
          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] flex flex-col justify-between space-y-6 hover:border-emerald-500/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                  Capacitor 6.0
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'مشروع أندرويد ستوديو (Android Native)' : 'Android Studio Native Project'}
                </h3>
                <p className="text-xs text-[#97A4B5] mt-1.5 leading-relaxed">
                  {isAr
                    ? 'مشروع أندرويد أصلي متكامل جاهز للفتح في Android Studio وتوقيعه واستخراج ملفات APK و AAB للنشر على متجر Google Play.'
                    : 'Native Android Studio project with Gradle, AndroidManifest.xml, strings.xml, ready to build signed APK/AAB.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#233247]">
              <button
                onClick={() => handleTriggerBuild('android', 'Android Studio Project')}
                disabled={isBuilding}
                className="w-full py-3 rounded-2xl bg-[#101B2C] hover:bg-[#233247] border border-[#233247] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'تنزيل مشروع أندرويد (.ZIP)' : 'Download Android Project'}</span>
              </button>
            </div>
          </div>

          {/* Target 3: iOS Xcode Project */}
          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] flex flex-col justify-between space-y-6 hover:border-blue-500/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Apple className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-bold">
                  Xcode Workspace
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'مشروع آبل آي أو إس (iOS Xcode)' : 'iOS Xcode Workspace'}
                </h3>
                <p className="text-xs text-[#97A4B5] mt-1.5 leading-relaxed">
                  {isAr
                    ? 'مشروع Xcode جاهز للفتح على أجهزة macOS مع إعدادات CocoaPods و Info.plist لبناء حزم iOS للنشر على App Store و TestFlight.'
                    : 'Xcode workspace with Podfile and Info.plist, ready for iOS compilation and App Store publishing.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#233247]">
              <button
                onClick={() => handleTriggerBuild('ios', 'iOS Xcode Workspace')}
                disabled={isBuilding}
                className="w-full py-3 rounded-2xl bg-[#101B2C] hover:bg-[#233247] border border-[#233247] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>{isAr ? 'تنزيل مشروع iOS (.ZIP)' : 'Download iOS Project'}</span>
              </button>
            </div>
          </div>

          {/* Target 4: PWA */}
          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] flex flex-col justify-between space-y-6 hover:border-amber-500/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">
                  PWA Standalone
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'تطبيق الويب التقدمي (PWA)' : 'Progressive Web App (PWA)'}
                </h3>
                <p className="text-xs text-[#97A4B5] mt-1.5 leading-relaxed">
                  {isAr
                    ? 'حزمة الويب التقدمية مع Service Worker و Web App Manifest لتثبيت التطبيق على الشاشة الرئيسية وتخزين الكاش بدون اتصال.'
                    : 'PWA distribution package with Service Worker, Web App Manifest, and offline caching strategy.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#233247]">
              <button
                onClick={() => handleTriggerBuild('pwa', 'PWA Distribution')}
                disabled={isBuilding}
                className="w-full py-3 rounded-2xl bg-[#101B2C] hover:bg-[#233247] border border-[#233247] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'تنزيل حزمة PWA (.ZIP)' : 'Download PWA Bundle'}</span>
              </button>
            </div>
          </div>

          {/* Target 5: Docker Self-Hosted */}
          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] flex flex-col justify-between space-y-6 hover:border-purple-500/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Server className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-bold">
                  Docker Compose
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'حزمة النشر الذاتي (Docker Stack)' : 'Docker Self-Hosted Stack'}
                </h3>
                <p className="text-xs text-[#97A4B5] mt-1.5 leading-relaxed">
                  {isAr
                    ? 'حاوية Docker متعددة الخدمات تضم السيرفر وقاعدة البيانات و Nginx مع إعدادات التشغيل التلقائي بضغطة زر واحدة.'
                    : 'Multi-container Docker Compose with Node.js Express API, static frontend Nginx, and PostgreSQL.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#233247]">
              <button
                onClick={() => handleTriggerBuild('docker', 'Docker Compose Stack')}
                disabled={isBuilding}
                className="w-full py-3 rounded-2xl bg-[#101B2C] hover:bg-[#233247] border border-[#233247] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>{isAr ? 'تنزيل حزمة Docker (.ZIP)' : 'Download Docker Stack'}</span>
              </button>
            </div>
          </div>

          {/* Target 6: Web Production SPA */}
          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] flex flex-col justify-between space-y-6 hover:border-cyan-500/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-bold">
                  Vite Static SPA
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'حزمة الواجهة للويب (Web SPA)' : 'Web Production SPA'}
                </h3>
                <p className="text-xs text-[#97A4B5] mt-1.5 leading-relaxed">
                  {isAr
                    ? 'ملفات الواجهة الثابتة المجمعة الجاهزة للرفع على Vercel أو Netlify أو Cloudflare Pages أو سيرفر Nginx.'
                    : 'Compiled static assets ready for deployment on Vercel, Netlify, Cloudflare Pages, or static Nginx host.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#233247]">
              <button
                onClick={() => handleTriggerBuild('web', 'Web Production SPA')}
                disabled={isBuilding}
                className="w-full py-3 rounded-2xl bg-[#101B2C] hover:bg-[#233247] border border-[#233247] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>{isAr ? 'تنزيل حزمة الويب (.ZIP)' : 'Download Web SPA'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ARTIFACTS HISTORY */}
      {activeTab === 'artifacts' && (
        <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                {isAr ? 'سجل الحزم المولدة والموثقة' : 'Generated Artifacts Repository'}
              </h2>
              <p className="text-xs text-[#97A4B5] mt-1">
                {isAr ? 'الحزم المسجلة والمحفوظة مع البصمة الرقمية وحجم الملف' : 'Persistent build artifacts with verified SHA-256 signatures'}
              </p>
            </div>

            <button
              onClick={fetchArtifacts}
              className="p-2 rounded-xl bg-[#101B2C] hover:bg-[#233247] border border-[#233247] text-[#97A4B5] hover:text-white transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loadingArtifacts ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {artifacts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <FolderArchive className="w-12 h-12 text-[#97A4B5]/40 mx-auto" />
              <div className="text-sm font-bold text-white">
                {isAr ? 'لا توجد حزم مصدرة بعد' : 'No generated artifacts yet'}
              </div>
              <p className="text-xs text-[#97A4B5] max-w-sm mx-auto">
                {isAr 
                  ? 'اختر أحد أهداف النشر واضغط "توليد الحزمة" لبدء خط التجميع وإنشاء حزمة قابلة للتحميل.'
                  : 'Select a delivery target to generate and download your first verifiable codebase package.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#233247]">
              {artifacts.map((art) => (
                <div key={art.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{art.fileName}</span>
                      <span className="px-2 py-0.5 rounded bg-[#C9A45C]/10 text-[#C9A45C] border border-[#C9A45C]/20 text-[10px] font-mono">
                        v{art.version}
                      </span>
                      {art.fileSizeMb && (
                        <span className="text-xs text-[#97A4B5] font-mono">{art.fileSizeMb}</span>
                      )}
                    </div>
                    {art.checksum && (
                      <div className="text-[11px] text-[#97A4B5] font-mono flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>SHA-256: {art.checksum.substring(0, 16)}...{art.checksum.substring(art.checksum.length - 8)}</span>
                      </div>
                    )}
                    <div className="text-[11px] text-[#97A4B5]">
                      {new Date(art.createdAt).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadArtifact(art)}
                    className="px-4 py-2 rounded-xl bg-[#101B2C] hover:bg-[#233247] border border-[#233247] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-[#C9A45C]" />
                    <span>{isAr ? 'تنزيل الحزمة' : 'Download Package'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DEPLOYMENT GUIDES */}
      {activeTab === 'deploy_guides' && (
        <div className="space-y-6">
          
          {/* Guide 1: Docker Compose */}
          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isAr ? '1. النشر عبر Docker Compose على سيرفر خاص' : '1. Deploy via Docker Compose'}
                  </h3>
                  <div className="text-xs text-[#97A4B5]">Ubuntu / Debian / AWS EC2 / DigitalOcean</div>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(`docker compose up -d --build`, 'docker_cmd')}
                className="px-3 py-1.5 rounded-lg bg-[#101B2C] border border-[#233247] text-xs text-[#97A4B5] hover:text-white flex items-center gap-1.5"
              >
                {copiedIndex === 'docker_cmd' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isAr ? 'نسخ الأمر' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{`# 1. Unzip the downloaded package
unzip ${activeTenant.slug}-full_stack-v1.0.0.zip
cd ${activeTenant.slug}

# 2. Configure environment
cp .env.example .env

# 3. Start containers in background
docker compose -f config/docker-compose.yml up -d --build`}
            </pre>
          </div>

          {/* Guide 2: Native Ubuntu / PM2 */}
          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9A45C]/10 border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C]">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isAr ? '2. النشر التقليدي على VPS بواسطة PM2 و Nginx' : '2. Deploy on VPS with PM2 & Nginx'}
                  </h3>
                  <div className="text-xs text-[#97A4B5]">Node.js 20 LTS + Nginx Reverse Proxy</div>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(`npm ci && npm run build && pm2 start backend/dist/server.js`, 'pm2_cmd')}
                className="px-3 py-1.5 rounded-lg bg-[#101B2C] border border-[#233247] text-xs text-[#97A4B5] hover:text-white flex items-center gap-1.5"
              >
                {copiedIndex === 'pm2_cmd' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isAr ? 'نسخ الأمر' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] font-mono text-xs text-[#C9A45C] overflow-x-auto leading-relaxed">
{`# 1. Install dependencies & build
npm ci
npm run build

# 2. Start backend server with PM2
pm2 start backend/dist/server.js --name "${activeTenant.slug}-api"
pm2 save

# 3. Configure Nginx with config/nginx.conf
sudo cp config/nginx.conf /etc/nginx/sites-available/${activeTenant.slug}
sudo ln -s /etc/nginx/sites-available/${activeTenant.slug} /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx`}
            </pre>
          </div>

        </div>
      )}

      {/* TAB 4: IDENTITY & VERSIONS */}
      {activeTab === 'identity' && (
        <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">
              {isAr ? 'إعدادات هوية الحزم والمعرّفات' : 'Package Identity & Naming Tokens'}
            </h2>
            <p className="text-xs text-[#97A4B5] mt-1">
              {isAr ? 'المعرّفات التي يتم تضمينها في ملفات AndroidManifest و Info.plist و package.json' : 'Bundle identifiers injected into native app manifests and configs'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#97A4B5] mb-2">{isAr ? 'اسم التطبيق' : 'App Name'}</label>
              <input
                type="text"
                value={identityConfig.appName}
                onChange={(e) => setIdentityConfig({ ...identityConfig, appName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-white text-xs font-mono focus:border-[#C9A45C] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#97A4B5] mb-2">{isAr ? 'رقم الإصدار (Semantic Version)' : 'Version'}</label>
              <input
                type="text"
                value={identityConfig.version}
                onChange={(e) => setIdentityConfig({ ...identityConfig, version: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-white text-xs font-mono focus:border-[#C9A45C] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#97A4B5] mb-2">Android Package ID</label>
              <input
                type="text"
                value={identityConfig.packageName}
                onChange={(e) => setIdentityConfig({ ...identityConfig, packageName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-white text-xs font-mono focus:border-[#C9A45C] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#97A4B5] mb-2">iOS Bundle ID</label>
              <input
                type="text"
                value={identityConfig.bundleId}
                onChange={(e) => setIdentityConfig({ ...identityConfig, bundleId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-white text-xs font-mono focus:border-[#C9A45C] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#233247] flex justify-end">
            <button
              onClick={() => showToast(isAr ? 'تم حفظ إعدادات الهوية بنجاح' : 'Identity configuration saved', 'success')}
              className="px-6 py-2.5 rounded-xl bg-[#C9A45C] hover:bg-[#E0C078] text-[#050B14] text-xs font-bold transition-all shadow-md shadow-[#C9A45C]/20"
            >
              {isAr ? 'حفظ الإعدادات' : 'Save Configuration'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
