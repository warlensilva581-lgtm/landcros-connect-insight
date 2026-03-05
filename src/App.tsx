import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, ClipboardList, AlertTriangle, ShoppingCart, CheckCircle2, XCircle, ChevronRight,
  Download, Filter, Package, Menu, X, Map as MapIcon, List, Info, ArrowLeft, Trash2,
  Lock, Unlock, Camera, Lightbulb, Maximize2, Copy, Plus, Save, Upload, FilePlus,
  Settings, RefreshCw, Wrench, Eye, Shield, ShieldCheck, ShieldAlert, Sun, Contrast,
  Droplets, Palette, RotateCcw, Image as ImageIcon, Sparkles, BrainCircuit, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PARTS_DATA, Part } from './partsData';
import { MACHINE_DATABASE } from './machineData';
import { supabase } from './supabase';
import { analyzeImage, generateReportSummary } from './services/geminiService';

type ListType = 'order' | 'damaged';
type ViewMode = 'visual' | 'list';

interface SelectedItem {
  part: Part;
  type: ListType;
  timestamp: number;
  photo?: string;
  diagramCrop?: string;
}

interface InspectionInfo {
  model: string;
  sn: string;
  tag: string;
  delivery: string;
  customer: string;
  description: string;
  machineDown: boolean;
  inspectorName: string;
  hourMeter: string;
  date: string;
  conclusion: string;
}

const TRANSLATIONS = {
  en: {
    inspection: 'INSPECTION',
    photos: 'PHOTOS',
    technicalReport: 'Technical Report',
    inspectionInfo: 'Inspection Information',
    machineInfo: 'Machine Information',
    model: 'Model:',
    sn: 'SN:',
    tag: 'TAG:',
    delivery: 'Delivery:',
    customer: 'Customer:',
    description: 'Description:',
    machineDown: 'MACHINE DOWN?:',
    reportData: 'REPORT DATA',
    inspectionDate: 'Inspection Date:',
    inspectorName: 'Inspector Name:',
    hourMeter: 'Hour Meter:',
    partNumber: 'Part Number:',
    qty: 'Qty:',
    noPhoto: 'No Inspection Photo',
    noDiagram: 'No Linked Diagram',
    catalogRef: 'Parts Catalog Reference',
    partsTable: 'Parts Table (Part Number)',
    partName: 'Part Name',
    quantity: 'Quantity',
    associatedPhoto: 'Associated Photo',
    conclusion: 'CONCLUSION',
    end: 'END',
    safetyQuote1: '"If it\'s not safe, don\'t do it!"',
    safetyQuote2: '"There is nothing so important and urgent that it can\'t be done safely"',
    yes: 'Yes',
    no: 'No',
    orderList: 'Order List',
    damageReport: 'Damage Report',
    date: 'Date:',
    totalItems: 'Total Items:',
    platform: 'Platform: LANDCROS Connect Insight',
    photoEvidence: 'Photographic Evidence',
    item: 'Item',
    desc: 'Description:',
    photoError: '[Error processing image for PDF]',
    generatePDF: 'Generate PDF Report',
    machineData: 'Machine Data',
    selectMachine: 'Select Machine',
    selectMachinePlaceholder: 'Select a machine...',
    inspectionDescription: 'Inspection Description',
    machineDownQuestion: 'Machine Down?',
    inspectorData: 'Inspector Data',
    reportConclusion: 'Report Conclusion',
    conclusionPlaceholder: 'Write the technical conclusion of the inspection here...',
    backToInspect: 'Back to Inspection',
    noItems: 'No items registered in this list.',
    selectItemOnDiagram: 'Select an item on the diagram',
    exportPDF: 'Export PDF',
    orders: 'Orders',
    damages: 'Damages',
    copy: 'Copy',
    gallery: 'Gallery',
    addEvidence: 'Add Evidence',
    restrictedAccess: 'Restricted Access',
    enterPin: 'Enter developer PIN to continue.',
    cancel: 'Cancel',
    enter: 'Enter',
    newInspection: 'New Inspection (Saves current and clears)',
    manageProjects: 'Manage Projects',
    viewMode: 'View Mode',
    editMode: 'Image Edit Mode',
    hideDetails: 'Hide Details (Larger Image)',
    showDetails: 'Show Details',
    lockSettings: 'Lock Settings',
    unlockDevMode: 'Unlock Developer Mode',
    localSaveWarning: 'Data is saved locally in this browser.',
    clearAll: 'Clear All',
    syncing: 'Syncing...',
    synced: 'Synced',
    offline: 'Offline',
    masterMode: 'Master Mode'
  },
  pt: {
    inspection: 'INSPEÇÃO',
    photos: 'FOTOS',
    technicalReport: 'Relatório Técnico',
    inspectionInfo: 'Informações da Inspeção',
    machineInfo: 'Informações da Máquina',
    model: 'Modelo:',
    sn: 'Série:',
    tag: 'TAG:',
    delivery: 'Entrega:',
    customer: 'Cliente:',
    description: 'Descrição:',
    machineDown: 'MÁQUINA PARADA?:',
    reportData: 'DADOS DO RELATÓRIO',
    inspectionDate: 'Data da Inspeção:',
    inspectorName: 'Nome do Inspetor:',
    hourMeter: 'Horímetro:',
    partNumber: 'Part Number:',
    qty: 'Qtd:',
    noPhoto: 'Sem Foto de Inspeção',
    noDiagram: 'Sem Diagrama Vinculado',
    catalogRef: 'Referência do Catálogo de Peças',
    partsTable: 'Tabela de Peças (Part Number)',
    partName: 'Nome da Peça',
    quantity: 'Quantidade',
    associatedPhoto: 'Foto Associada',
    conclusion: 'CONCLUSÃO',
    end: 'FIM',
    safetyQuote1: '"Se não é seguro, não faça!"',
    safetyQuote2: '"Não há nada tão importante e urgente que não possa ser feito com segurança"',
    yes: 'Sim',
    no: 'Não',
    orderList: 'Lista de Pedidos',
    damageReport: 'Relatório de Avarias',
    date: 'Data:',
    totalItems: 'Total de Itens:',
    platform: 'Plataforma: LANDCROS Connect Insight',
    photoEvidence: 'Evidências Fotográficas',
    item: 'Item',
    desc: 'Descrição:',
    photoError: '[Erro ao processar imagem para o PDF]',
    generatePDF: 'Gerar Relatório PDF',
    machineData: 'Dados da Máquina',
    selectMachine: 'Selecionar Máquina',
    selectMachinePlaceholder: 'Selecione uma máquina...',
    inspectionDescription: 'Descrição da Inspeção',
    machineDownQuestion: 'Máquina Parada?',
    inspectorData: 'Dados do Inspetor',
    reportConclusion: 'Conclusão do Relatório',
    conclusionPlaceholder: 'Escreva aqui a conclusão técnica da inspeção...',
    backToInspect: 'Voltar para Inspeção',
    noItems: 'Nenhum item registrado nesta lista.',
    selectItemOnDiagram: 'Selecione um item no diagrama',
    exportPDF: 'Exportar PDF',
    orders: 'Pedidos',
    damages: 'Avarias',
    copy: 'Cópia',
    gallery: 'Galeria',
    addEvidence: 'Adicionar Evidência',
    restrictedAccess: 'Acesso Restrito',
    enterPin: 'Digite a senha de desenvolvedor para continuar.',
    cancel: 'Cancelar',
    enter: 'Entrar',
    newInspection: 'Nova Inspeção (Salva atual e limpa)',
    manageProjects: 'Gerenciar Projetos',
    viewMode: 'Modo Visualização',
    editMode: 'Modo Edição de Imagem',
    hideDetails: 'Ocultar Detalhes (Imagem Maior)',
    showDetails: 'Mostrar Detalhes',
    lockSettings: 'Bloquear Configurações',
    unlockDevMode: 'Liberar Modo Desenvolvedor',
    localSaveWarning: 'Os dados são salvos localmente neste navegador.',
    clearAll: 'Limpar Tudo',
    syncing: 'Sincronizando...',
    synced: 'Sincronizado',
    offline: 'Offline',
    masterMode: 'Modo Mestre'
  }
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(PARTS_DATA[0].category);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(() => {
    const saved = localStorage.getItem('selectedItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [inspectionInfo, setInspectionInfo] = useState<InspectionInfo>(() => {
    const saved = localStorage.getItem('inspectionInfo');
    return saved ? JSON.parse(saved) : {
      model: 'EX1200-6',
      sn: 'FF018JQ001014',
      tag: 'EH-4012',
      delivery: '2008',
      customer: 'U/M',
      description: 'Technical Inspection',
      machineDown: false,
      inspectorName: 'WARLEN SILVA',
      hourMeter: '76268,1',
      date: new Date().toISOString().split('T')[0],
      conclusion: ''
    };
  });
  const [reportLanguage, setReportLanguage] = useState<'pt' | 'en'>(() => {
    const saved = localStorage.getItem('reportLanguage');
    return (saved as 'pt' | 'en') || 'en';
  });

  const [viewMode, setViewMode] = useState<ViewMode>('visual');
  const [focusedPart, setFocusedPart] = useState<Part | null>(null);
  const [diagramImages, setDiagramImages] = useState<Record<string, string | null>>(() => {
    const saved = localStorage.getItem('diagramImages');
    return saved ? JSON.parse(saved) : {};
  });

  const [imgConfigs, setImgConfigs] = useState<Record<string, { scale: number, x: number, y: number, isLocked?: boolean }>>(() => {
    const saved = localStorage.getItem('imgConfigs');
    return saved ? JSON.parse(saved) : {};
  });

  const [savedConfigs, setSavedConfigs] = useState<Record<string, { scale: number, x: number, y: number }>>(() => {
    const saved = localStorage.getItem('savedConfigs');
    return saved ? JSON.parse(saved) : {};
  });

  const [customPositions, setCustomPositions] = useState<Record<string, Record<string, { top: string, left: string }>>>(() => {
    const saved = localStorage.getItem('customPositions');
    return saved ? JSON.parse(saved) : {};
  });

  const [imgFilters, setImgFilters] = useState<Record<string, { brightness: number, contrast: number, grayscale: number }>>(() => {
    const saved = localStorage.getItem('imgFilters');
    return saved ? JSON.parse(saved) : {};
  });

  const [dragKey, setDragKey] = useState(0);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBlueprintMode, setIsBlueprintMode] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hotspotSize, setHotspotSize] = useState(() => {
    const saved = localStorage.getItem('hotspotSize');
    return saved ? parseInt(saved) : 36;
  });
  const [individualHotspotSizes, setIndividualHotspotSizes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('individualHotspotSizes');
    return saved ? JSON.parse(saved) : {};
  });
  const [isDetailsVisible, setIsDetailsVisible] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('customCategories');
    return saved ? JSON.parse(saved) : [];
  });
  const [pinInput, setPinInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [syncStatus, setSyncStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'unconfigured'>('connecting');
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
  const [isSyncing, setIsSyncing] = useState(false);
  const isRemoteUpdate = useRef(false);

  const [activeTab, setActiveTab] = useState<'inspect' | 'order' | 'damaged' | 'projects' | 'report'>('report');
  const [projectName, setProjectName] = useState(() => localStorage.getItem('projectName') || 'Nova Inspeção');
  const [adminPin, setAdminPin] = useState(() => localStorage.getItem('adminPin') || '1234');
  const [clonedParts, setClonedParts] = useState<Record<string, Part[]>>(() => {
    const saved = localStorage.getItem('clonedParts');
    return saved ? JSON.parse(saved) : {};
  });

  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const diagramContainerRef = useRef<HTMLDivElement>(null);
  const categories = useMemo(() => [...PARTS_DATA.map(p => p.category), ...customCategories], [customCategories]);
  const addSyncLog = (msg: string) => {
    setSyncLog(prev => [msg, ...prev].slice(0, 50));
    console.log(`[SYNC] ${msg}`);
  };

  // Sincronização com Supabase
  useEffect(() => {
    if (!supabase) {
      setSyncStatus('unconfigured');
      return;
    }

    setSyncStatus('connecting');

    const processRemoteRow = (key: string, value: string) => {
      try {
        const val = JSON.parse(value);
        if (key.startsWith('diagramImage_')) {
          const cat = key.replace('diagramImage_', '');
          setDiagramImages(prev => ({ ...prev, [cat]: val }));
        } else {
          const setters: Record<string, (v: any) => void> = {
            imgConfigs: setImgConfigs,
            savedConfigs: setSavedConfigs,
            customPositions: setCustomPositions,
            imgFilters: setImgFilters,
            hotspotSize: setHotspotSize,
            individualHotspotSizes: setIndividualHotspotSizes,
            customCategories: setCustomCategories,
            projectName: setProjectName,
            inspectionInfo: setInspectionInfo,
            selectedItems: setSelectedItems,
            clonedParts: setClonedParts,
            aiAnalysis: setAiAnalysis,
            aiSummary: setAiSummary
          };
          if (setters[key]) setters[key](val);
        }
      } catch (e) {
        console.error(`Erro ao processar chave remota ${key}:`, e);
      }
    };

    const fetchInitialState = async () => {
      const { data, error } = await supabase.from('app_state').select('*');
      if (error) {
        setSyncStatus('disconnected');
        return;
      }
      if (data && data.length > 0) {
        isRemoteUpdate.current = true;
        data.forEach(row => processRemoteRow(row.key, row.value));
        setTimeout(() => { isRemoteUpdate.current = false; }, 2000);
      }
      setSyncStatus('connected');
    };

    fetchInitialState();

    const channel = supabase.channel('app_changes')
      .on('broadcast', { event: 'UPDATE_STATE' }, ({ payload }) => {
        isRemoteUpdate.current = true;
        Object.entries(payload).forEach(([key, val]) => {
          const setters: Record<string, (v: any) => void> = {
            imgConfigs: setImgConfigs,
            savedConfigs: setSavedConfigs,
            customPositions: setCustomPositions,
            imgFilters: setImgFilters,
            hotspotSize: setHotspotSize,
            individualHotspotSizes: setIndividualHotspotSizes,
            customCategories: setCustomCategories,
            projectName: setProjectName,
            inspectionInfo: setInspectionInfo,
            selectedItems: setSelectedItems,
            clonedParts: setClonedParts,
            aiAnalysis: setAiAnalysis,
            aiSummary: setAiSummary
          };
          if (setters[key]) setters[key](val);
        });
        setTimeout(() => { isRemoteUpdate.current = false; }, 2000);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const broadcastUpdate = async (updates: Record<string, any>) => {
    if (isRemoteUpdate.current || !supabase) return;
    const finalUpdates = { ...updates };
    const imageUpdates: Record<string, any> = {};
    
    if (finalUpdates.diagramImages) {
      Object.entries(finalUpdates.diagramImages).forEach(([cat, img]) => {
        if (img) imageUpdates[`diagramImage_${cat}`] = img;
      });
      delete finalUpdates.diagramImages;
    }

    const allUpdates = { ...finalUpdates, ...imageUpdates };
    const entries = Object.entries(allUpdates);
    
    setIsSyncing(true);
    setSyncProgress({ current: 0, total: entries.length });

    await supabase.channel('app_changes').send({
      type: 'broadcast',
      event: 'UPDATE_STATE',
      payload: finalUpdates
    });

    for (const [key, value] of entries) {
      await supabase.from('app_state').upsert({ key, value: JSON.stringify(value) });
    }
    
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const handleAiAnalysis = async (part: Part, photo: string) => {
    setIsAnalyzing(true);
    const result = await analyzeImage(photo, part.description);
    const newAnalysis = { ...aiAnalysis, [part.id]: result };
    setAiAnalysis(newAnalysis);
    broadcastUpdate({ aiAnalysis: newAnalysis });
    setIsAnalyzing(false);
  };

  const handleAiSummary = async () => {
    setIsGeneratingSummary(true);
    const result = await generateReportSummary(projectName, inspectionInfo, selectedItems);
    setAiSummary(result);
    broadcastUpdate({ aiSummary: result });
    setIsGeneratingSummary(false);
  };

  // Persistência Local
  useEffect(() => {
    if (isRemoteUpdate.current) return;
    const save = () => {
      localStorage.setItem('diagramImages', JSON.stringify(diagramImages));
      localStorage.setItem('imgConfigs', JSON.stringify(imgConfigs));
      localStorage.setItem('customPositions', JSON.stringify(customPositions));
      localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
      localStorage.setItem('clonedParts', JSON.stringify(clonedParts));
      localStorage.setItem('imgFilters', JSON.stringify(imgFilters));
      localStorage.setItem('inspectionInfo', JSON.stringify(inspectionInfo));
      localStorage.setItem('projectName', projectName);
      localStorage.setItem('hotspotSize', hotspotSize.toString());
      localStorage.setItem('individualHotspotSizes', JSON.stringify(individualHotspotSizes));
      localStorage.setItem('customCategories', JSON.stringify(customCategories));
      setSaveStatus('saved');
    };
    setSaveStatus('saving');
    const timeout = setTimeout(save, 1000);
    return () => clearTimeout(timeout);
  }, [diagramImages, imgConfigs, customPositions, selectedItems, clonedParts, imgFilters, inspectionInfo, projectName, hotspotSize, individualHotspotSizes, customCategories]);
  const exportProject = () => {
    const data = { projectName, diagramImages, imgConfigs, imgFilters, customPositions, selectedItems, clonedParts, customCategories, inspectionInfo, version: '1.2' };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.landcros`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.diagramImages) setDiagramImages(data.diagramImages);
        if (data.imgConfigs) setImgConfigs(data.imgConfigs);
        if (data.customPositions) setCustomPositions(data.customPositions);
        if (data.selectedItems) setSelectedItems(data.selectedItems);
        if (data.clonedParts) setClonedParts(data.clonedParts);
        if (data.imgFilters) setImgFilters(data.imgFilters);
        if (data.customCategories) setCustomCategories(data.customCategories);
        if (data.inspectionInfo) setInspectionInfo(data.inspectionInfo);
        if (data.projectName) setProjectName(data.projectName);
        alert('Projeto importado com sucesso!');
      } catch (err) { alert('Erro ao importar projeto.'); }
    };
    reader.readAsText(file);
  };

  const duplicatePart = (part: Part) => {
    const newId = `${part.id}-clone-${Date.now()}`;
    const newPart: Part = { ...part, id: newId };
    setClonedParts(prev => ({ ...prev, [selectedCategory]: [...(prev[selectedCategory] || []), newPart] }));
    const originalPos = (customPositions[selectedCategory] || {})[part.id];
    const initialPos = originalPos ? { top: `${parseFloat(originalPos.top) + 3}%`, left: `${parseFloat(originalPos.left) + 3}%` } : { top: '50%', left: '50%' };
    setCustomPositions(prev => ({ ...prev, [selectedCategory]: { ...(prev[selectedCategory] || {}), [newId]: initialPos } }));
    setFocusedPart(newPart);
  };

  const removeClone = (partId: string) => {
    setClonedParts(prev => ({ ...prev, [selectedCategory]: (prev[selectedCategory] || []).filter(p => p.id !== partId) }));
    setSelectedItems(prev => prev.filter(i => i.part.id !== partId));
    setFocusedPart(null);
  };

  const toggleItem = (part: Part, type: ListType) => {
    const exists = selectedItems.find(i => i.part.id === part.id && i.type === type);
    if (exists) setSelectedItems(prev => prev.filter(i => !(i.part.id === part.id && i.type === type)));
    else setSelectedItems(prev => [...prev, { part, type, timestamp: Date.now() }]);
  };

  const isSelected = (partId: string, type: ListType) => selectedItems.some(i => i.part.id === partId && i.type === type);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setDiagramImages(prev => ({ ...prev, [selectedCategory]: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleBulkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const catName = file.name.split('.')[0];
        setDiagramImages(prev => ({ ...prev, [catName]: base64 }));
        if (!categories.includes(catName)) setCustomCategories(prev => [...prev, catName]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragEnd = (partId: string, info: any) => {
    if (!diagramContainerRef.current) return;
    const rect = diagramContainerRef.current.getBoundingClientRect();
    const x = ((info.point.x - rect.left) / rect.width) * 100;
    const y = ((info.point.y - rect.top) / rect.height) * 100;
    setCustomPositions(prev => ({ ...prev, [selectedCategory]: { ...(prev[selectedCategory] || {}), [partId]: { top: `${y}%`, left: `${x}%` } } }));
  };

  const filteredParts = useMemo(() => {
    const baseParts = PARTS_DATA.filter(p => p.category === selectedCategory);
    const clones = clonedParts[selectedCategory] || [];
    const all = [...baseParts, ...clones];
    return all.filter(p => p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, selectedCategory, clonedParts]);

  const currentImg = diagramImages[selectedCategory];
  const currentConfig = imgConfigs[selectedCategory] || { scale: 1, x: 0, y: 0 };
  const currentFilters = imgFilters[selectedCategory] || { brightness: 100, contrast: 100, grayscale: 0 };

  const handleCaptureEvidence = (part: Part) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedItems(prev => prev.map(item => item.part.id === part.id ? { ...item, photo: base64 } : item));
        handleAiAnalysis(part, base64);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const t = TRANSLATIONS[reportLanguage];
    doc.setFontSize(20);
    doc.text(t.technicalReport, 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`${t.model} ${inspectionInfo.model}`, 20, 40);
    doc.text(`${t.sn} ${inspectionInfo.sn}`, 20, 45);
    doc.text(`${t.customer} ${inspectionInfo.customer}`, 20, 50);
    doc.text(`${t.date} ${inspectionInfo.date}`, 20, 55);
    
    autoTable(doc, {
      startY: 70,
      head: [[t.item, t.partNumber, t.partName, t.quantity, 'Status']],
      body: selectedItems.map(i => [i.part.itemNumber, i.part.partNumber, i.part.description, 1, i.type === 'order' ? t.orders : t.damages])
    });
    
    doc.save(`${projectName}.pdf`);
  };

  const toggleAdmin = () => {
    if (isAdmin) { setIsAdmin(false); return; }
    setShowPinModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-landcros/30">
      <AnimatePresence>
        {showPinModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-[32px] p-8 space-y-6 shadow-2xl">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-landcros/10 rounded-2xl flex items-center justify-center mx-auto text-landcros"><Lock size={32} /></div>
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">Acesso Restrito</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Digite o PIN de Desenvolvedor</p>
              </div>
              <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-2xl font-mono tracking-[1em] focus:border-landcros outline-none transition-all" autoFocus />
              <div className="flex gap-3">
                <button onClick={() => setShowPinModal(false)} className="flex-1 p-4 rounded-2xl font-bold uppercase tracking-widest text-zinc-500 hover:bg-white/5 transition-all">Cancelar</button>
                <button onClick={() => { if (pinInput === adminPin || pinInput === '1234') { setIsAdmin(true); setShowPinModal(false); } else { alert('PIN Incorreto'); setPinInput(''); } }} className="flex-1 p-4 rounded-2xl font-bold uppercase tracking-widest bg-landcros text-white hover:bg-orange-600 transition-all">Entrar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed left-0 top-0 bottom-0 w-[80px] bg-[#0a0a0a] border-r border-white/5 flex flex-col items-center py-8 z-50 hidden md:flex">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-12 overflow-hidden">
          <img src="https://hitachi-original.com/wp-content/uploads/2021/05/hitachi-logo.png" className="w-8 object-contain" alt="Logo" />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {[
            { id: 'report', icon: ClipboardList, label: 'Relatório' },
            { id: 'inspect', icon: MapIcon, label: 'Inspeção' },
            { id: 'order', icon: ShoppingCart, label: 'Pedidos' },
            { id: 'damaged', icon: AlertTriangle, label: 'Avarias' },
            { id: 'projects', icon: Settings, label: 'Projetos' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group relative ${activeTab === item.id ? 'bg-landcros text-white shadow-lg shadow-landcros/20' : 'text-zinc-600 hover:bg-white/5 hover:text-white'}`}>
              <item.icon size={20} />
              <span className="absolute left-full ml-4 px-2 py-1 bg-white text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest z-50">{item.label}</span>
            </button>
          ))}
        </div>
        <button onClick={toggleAdmin} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isAdmin ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'text-zinc-600 hover:bg-white/5'}`}><Shield size={20} /></button>
      </nav>
      <main className="md:pl-[80px] min-h-screen flex flex-col">
        <header className="h-[80px] bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-6 md:px-12 sticky top-0 z-40 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <div className="hidden md:block">
              <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">{projectName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${syncStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{syncStatus === 'connected' ? 'Sincronizado Nuvem' : 'Modo Offline'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportProject} className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-all border border-white/5"><Download size={18} /></button>
            <button onClick={() => setActiveTab('report')} className="px-6 py-3 bg-landcros text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all shadow-lg shadow-landcros/20">Gerar Relatório PDF</button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
          <aside className={`w-[280px] bg-[#0f0f0f] border-r border-white/5 flex flex-col shrink-0 transition-all duration-300 ${isSidebarCollapsed ? '-ml-[280px]' : ''}`}>
            <div className="p-6 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input type="text" placeholder="Buscar peça..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-landcros outline-none transition-all" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${selectedCategory === cat ? 'bg-landcros/10 text-landcros border border-landcros/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-widest truncate mr-2">{cat}</span>
                  <ChevronRight size={14} className={`transition-transform ${selectedCategory === cat ? 'rotate-90' : ''}`} />
                </button>
              ))}
              {isAdmin && (
                <button onClick={() => { const name = prompt('Nome da nova categoria:'); if (name) setCustomCategories(prev => [...prev, name]); }} className="w-full p-4 rounded-2xl border border-dashed border-white/10 text-zinc-600 hover:border-landcros hover:text-landcros transition-all flex items-center justify-center gap-2 mt-4">
                  <Plus size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Nova Sheet</span>
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
            <div className="absolute top-6 left-6 z-30 flex items-center gap-2">
              <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-landcros transition-all"><Menu size={18} /></button>
              <div className="px-4 py-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl flex items-center gap-3">
                <span className="text-[10px] font-black tracking-tighter uppercase italic text-landcros">{selectedCategory}</span>
              </div>
            </div>

            <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
              {isAdmin && (
                <div className="flex bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-1">
                  <button onClick={() => setIsAdjusting(!isAdjusting)} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${isAdjusting ? 'bg-landcros text-white' : 'text-zinc-500 hover:text-white'}`}>Ajustar Posições</button>
                  <label className="px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white cursor-pointer">
                    Upload Imagem
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              )}
            </div>

            <div ref={diagramContainerRef} className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
              <div className="relative w-full h-full flex items-center justify-center">
                {currentImg ? (
                  <div className="relative inline-block">
                    <img 
                      src={currentImg} 
                      className="max-w-full max-h-full object-contain pointer-events-none select-none" 
                      style={{ filter: `brightness(${currentFilters.brightness}%) contrast(${currentFilters.contrast}%) grayscale(${currentFilters.grayscale}%)` }} 
                      alt="Diagrama" 
                    />
                    <div className="absolute inset-0">
                      {filteredParts.map(part => {
                        const pos = (customPositions[selectedCategory] || {})[part.id] || { top: '50%', left: '50%' };
                        const isFocused = focusedPart?.id === part.id;
                        const hasOrder = isSelected(part.id, 'order');
                        const hasDamage = isSelected(part.id, 'damaged');
                        const size = individualHotspotSizes[part.id] || hotspotSize;

                        return (
                          <motion.div
                            key={part.id}
                            drag={isAdjusting}
                            dragMomentum={false}
                            onDragEnd={(_, info) => handleDragEnd(part.id, info)}
                            className={`absolute z-20 ${isAdjusting ? 'cursor-move' : ''}`}
                            style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                          >
                            <button
                              onClick={() => !isAdjusting && setFocusedPart(part)}
                              className={`rounded-full flex items-center justify-center font-mono font-bold transition-all shadow-xl ${
                                isFocused ? 'bg-white text-black scale-125 ring-4 ring-landcros/30' : 
                                hasDamage ? 'bg-red-500 text-white' : 
                                hasOrder ? 'bg-landcros text-white' : 'bg-zinc-800/90 text-zinc-400 border border-white/10'
                              }`}
                              style={{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.max(8, size / 3.5)}px` }}
                            >
                              {part.itemNumber}
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-700 opacity-20">
                    <MapIcon size={80} className="mb-4" />
                    <p className="text-sm font-black uppercase italic tracking-tighter">Nenhuma imagem carregada nesta Sheet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {focusedPart && (
              <motion.aside initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="w-[400px] bg-[#0f0f0f] border-l border-white/5 flex flex-col shrink-0 z-40">
                <div className="p-8 flex-1 overflow-y-auto space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black tracking-tighter uppercase italic text-landcros">Detalhes da Peça</span>
                      <h2 className="text-3xl font-black tracking-tighter text-white leading-none">{focusedPart.partNumber}</h2>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">{focusedPart.description}</p>
                    </div>
                    <button onClick={() => setFocusedPart(null)} className="p-2 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all"><X size={20} /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => toggleItem(focusedPart, 'order')} className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${isSelected(focusedPart.id, 'order') ? 'bg-landcros text-white border-landcros shadow-lg shadow-landcros/20' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10'}`}>
                      <ShoppingCart size={24} /><span className="text-[10px] font-bold uppercase tracking-widest">Pedido</span>
                    </button>
                    <button onClick={() => toggleItem(focusedPart, 'damaged')} className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${isSelected(focusedPart.id, 'damaged') ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10'}`}>
                      <AlertTriangle size={24} /><span className="text-[10px] font-bold uppercase tracking-widest">Avaria</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <button onClick={() => duplicatePart(focusedPart)} className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-zinc-400 hover:text-white hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-[10px]">
                      <Copy size={16} /> Duplicar Peça
                    </button>
                    {focusedPart.id.includes('-clone-') && (
                      <button onClick={() => removeClone(focusedPart.id)} className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-3 text-red-500 hover:bg-red-500/20 transition-all font-bold uppercase tracking-widest text-[10px]">
                        <Trash2 size={16} /> Remover Cópia
                      </button>
                    )}
                  </div>

                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tamanho Individual</span>
                      <span className="text-[10px] font-mono text-landcros">{individualHotspotSizes[focusedPart.id] || hotspotSize}px</span>
                    </div>
                    <input 
                      type="range" min="20" max="100" 
                      value={individualHotspotSizes[focusedPart.id] || hotspotSize} 
                      onChange={(e) => setIndividualHotspotSizes(prev => ({ ...prev, [focusedPart.id]: parseInt(e.target.value) }))}
                      className="w-full accent-landcros" 
                    />
                    {individualHotspotSizes[focusedPart.id] && (
                      <button onClick={() => setIndividualHotspotSizes(prev => { const n = { ...prev }; delete n[focusedPart.id]; return n; })} className="w-full text-[8px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">Resetar para Padrão</button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black tracking-tighter uppercase italic text-zinc-500">Evidência Fotográfica</h4>
                      <button onClick={() => handleCaptureEvidence(focusedPart)} className="text-landcros hover:underline text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Camera size={14} /> Capturar</button>
                    </div>
                    <div className="aspect-video bg-white/5 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center relative group">
                      {selectedItems.find(i => i.part.id === focusedPart.id)?.photo ? (
                        <img src={selectedItems.find(i => i.part.id === focusedPart.id)?.photo} className="w-full h-full object-cover" alt="Evidência" />
                      ) : (
                        <div className="text-zinc-800 flex flex-col items-center gap-2"><ImageIcon size={32} /><span className="text-[8px] font-bold uppercase tracking-widest">Nenhuma foto capturada</span></div>
                      )}
                    </div>
                  </div>

                  {aiAnalysis[focusedPart.id] && (
                    <div className="bg-landcros/5 border border-landcros/10 p-6 rounded-3xl space-y-3">
                      <div className="flex items-center gap-2 text-landcros"><BrainCircuit size={16} /><span className="text-[10px] font-black uppercase italic tracking-tighter">Análise IA Gemini</span></div>
                      <p className="text-xs text-zinc-300 leading-relaxed italic">"{aiAnalysis[focusedPart.id]}"</p>
                    </div>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
