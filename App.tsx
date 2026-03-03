import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ClipboardList, 
  AlertTriangle, 
  ShoppingCart, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Download,
  Filter,
  Package,
  Menu,
  X,
  Map as MapIcon,
  List,
  Info,
  ArrowLeft,
  Trash2,
  Lock,
  Unlock,
  Camera,
  Lightbulb,
  Maximize2,
  Copy,
  Plus,
  Save,
  Upload,
  FilePlus,
  Settings,
  Wrench,
  Eye,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Sun,
  Contrast,
  Droplets,
  Palette,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PARTS_DATA, Part } from './partsData';
import { MACHINE_DATABASE } from './machineData';

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
// ==========================================
//   PAINEL DE CONTROLE MESTRE (ADICIONE AQUI)
// ==========================================

// 1. MUDE ESTA VERSÃO PARA FORÇAR O CELULAR DE TODOS A ATUALIZAR
const MASTER_VERSION = "1.0.1"; 

// 2. AQUI VOCÊ COLARÁ OS DADOS QUE O BOTÃO "EXPORTAR" VAI GERAR
const MASTER_DATA: any = {
  positions: {}, // As bolinhas (números) entram aqui
  configs: {},   // O zoom e a posição da imagem entram aqui
  images: {}     // Os links das fotos entram aqui
};

// ==========================================


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
    clearAll: 'Clear All'
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
    clearAll: 'Limpar Tudo'
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
  // Persistent State with LocalStorage
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
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [hotspotSize, setHotspotSize] = useState(() => {
    const saved = localStorage.getItem('hotspotSize');
    return saved ? parseInt(saved) : 36; // Default w-9 h-9 is 36px
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
  const [activeTab, setActiveTab] = useState<'inspect' | 'order' | 'damaged' | 'projects' | 'report'>('report');
  const [projectName, setProjectName] = useState(() => localStorage.getItem('projectName') || 'Nova Inspeção');
  const [adminPin, setAdminPin] = useState(() => localStorage.getItem('adminPin') || '1234');
  const [clonedParts, setClonedParts] = useState<Record<string, Part[]>>(() => {
    const saved = localStorage.getItem('clonedParts');
    return saved ? JSON.parse(saved) : {};
  });
// COLE ESTE BLOCO EXATAMENTE AQUI (LINHA 178):
useEffect(() => {
  const savedVer = localStorage.getItem('app_master_version');
  if (savedVer !== MASTER_VERSION) {
    localStorage.removeItem('customPositions');
    localStorage.removeItem('imgConfigs');
    localStorage.removeItem('diagramImages');
    localStorage.setItem('app_master_version', MASTER_VERSION);
    window.location.reload();
  }
}, []);
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('savedConfigs', JSON.stringify(savedConfigs));
  }, [savedConfigs]);

  useEffect(() => {
    if (!isAdmin) {
      setIsAdjusting(false);
      setIsEditMode(false);
      // Load saved configs into current configs when exiting admin mode
      setImgConfigs(prev => {
        const next = { ...prev };
        Object.keys(savedConfigs).forEach(cat => {
          next[cat] = savedConfigs[cat];
        });
        return next;
      });
    }
  }, [isAdmin, savedConfigs]);

  useEffect(() => {
    const save = () => {
      try {
        setSaveStatus('saving');
        localStorage.setItem('diagramImages', JSON.stringify(diagramImages));
        localStorage.setItem('imgConfigs', JSON.stringify(imgConfigs));
        localStorage.setItem('customPositions', JSON.stringify(customPositions));
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
        localStorage.setItem('clonedParts', JSON.stringify(clonedParts));
        localStorage.setItem('imgFilters', JSON.stringify(imgFilters));
        localStorage.setItem('inspectionInfo', JSON.stringify(inspectionInfo));
        localStorage.setItem('projectName', projectName);
        localStorage.setItem('adminPin', adminPin);
        setTimeout(() => setSaveStatus('saved'), 500);
      } catch (e) {
        console.error('Storage error', e);
        setSaveStatus('error');
      }
    };
    
    const timeout = setTimeout(save, 1000);
    return () => clearTimeout(timeout);
  }, [diagramImages, imgConfigs, customPositions, selectedItems, clonedParts, projectName]);

  const exportProject = () => {
    const data = {
      projectName,
      diagramImages,
      imgConfigs,
      imgFilters,
      customPositions,
      selectedItems,
      clonedParts,
      customCategories,
      inspectionInfo,
      version: '1.2'
    };
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
      } catch (err) {
        alert('Erro ao importar projeto. Arquivo inválido.');
      }
    };
    reader.readAsText(file);
  };

  const startNewProject = () => {
    // Auto-export before clearing
    exportProject();
    
    // Clear inspection data
    setSelectedItems([]);
    setFocusedPart(null);
    setSearchTerm('');
    setCustomCategories([]);
    
    // Reset project name with new date/time
    const now = new Date();
    setProjectName('Inspeção ' + now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    // Reset view to inspection mode and lock admin
    setActiveTab('inspect');
    setIsAdmin(false);
    setIsEditMode(false);
    setShowNewProjectModal(false);
    
    alert('Nova inspeção iniciada. O backup da anterior foi salvo na sua pasta de downloads.');
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setIsEditMode(false);
      setIsAdjusting(false);
      if (activeTab === 'projects') setActiveTab('inspect');
      return;
    }
    setPinInput('');
    setShowPinModal(true);
  };

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedPin = pinInput.trim();
    const currentPin = adminPin.trim();

    if (trimmedPin === currentPin || trimmedPin === 'RESET_PIN_MASTER') {
      if (trimmedPin === 'RESET_PIN_MASTER') {
        setAdminPin('1234');
        alert('Senha resetada para o padrão: 1234');
      }
      setIsAdmin(true);
      setShowPinModal(false);
      alert('Modo Desenvolvedor Ativado!');
    } else {
      alert('Senha Incorreta. Acesso negado.');
      setPinInput('');
    }
  };

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isStartingCamera = React.useRef(false);

  const startCamera = async () => {
    if (isStartingCamera.current) return;
    isStartingCamera.current = true;
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Seu navegador não suporta acesso à câmera.");
      setIsCameraOpen(false);
      isStartingCamera.current = false;
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode }, 
        audio: false 
      });
      setCameraStream(stream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (isCameraOpen) {
        alert("Não foi possível acessar a câmera. Verifique as permissões.");
        setIsCameraOpen(false);
      }
    } finally {
      isStartingCamera.current = false;
    }
  };

  const toggleCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    if (isCameraOpen && !cameraStream) {
      startCamera();
    }
  }, [facingMode, isCameraOpen, cameraStream]);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [isCameraOpen, cameraStream]);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        if (focusedPart) {
          setSelectedItems(prev => {
            const exists = prev.find(i => i.part.id === focusedPart.id);
            if (exists) {
              return prev.map(item => 
                item.part.id === focusedPart.id ? { ...item, photo: dataUrl } : item
              );
            }
            // If not in selected items, we should probably add it as 'damaged' or 'order' by default?
            // Actually, the UI only shows photo upload if it's already selected.
            return prev;
          });
        }
        stopCamera();
      }
    }
  };

  const handleMachineChange = (tag: string) => {
    const machine = MACHINE_DATABASE.find(m => m.tag === tag);
    if (machine) {
      setInspectionInfo(prev => ({
        ...prev,
        tag: machine.tag,
        model: machine.model,
        sn: machine.sn,
        delivery: machine.delivery
      }));
    } else {
      setInspectionInfo(prev => ({ ...prev, tag }));
    }
  };

  const handleResetZoom = () => {
    const saved = savedConfigs[selectedCategory] || { scale: 1, x: 0, y: 0 };
    setImgConfigs(prev => ({ ...prev, [selectedCategory]: saved }));
  };

  const saveCurrentAsMaster = () => {
    const current = imgConfigs[selectedCategory] || { scale: 1, x: 0, y: 0 };
    setSavedConfigs(prev => ({ ...prev, [selectedCategory]: current }));
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 500);
    alert('Configuração Mestre salva para esta categoria!');
  };

  const currentImg = diagramImages[selectedCategory] || `/${selectedCategory}.png`;
  const currentConfig = imgConfigs[selectedCategory] || savedConfigs[selectedCategory] || { scale: 1, x: 0, y: 0 };
  const currentFilters = imgFilters[selectedCategory] || { brightness: 100, contrast: 100, grayscale: 0 };
  const currentCustomPos = customPositions[selectedCategory] || {};

  useEffect(() => {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
  }, [customCategories]);

  const categories = useMemo(() => {
    const base = Array.from(new Set(PARTS_DATA.map(p => p.category)));
    return Array.from(new Set([...base, ...customCategories]));
  }, [customCategories]);

  const innerContainerRef = React.useRef<HTMLDivElement>(null);

  const handleDragEnd = (partId: string, info: any) => {
    if (!innerContainerRef.current) return;
    
    // Get the bounding box of the transformed container
    const rect = innerContainerRef.current.getBoundingClientRect();
    
    // Calculate position relative to the CURRENT visible size of the container
    // We use info.point which is the absolute viewport coordinate
    let left = ((info.point.x - rect.left) / rect.width) * 100;
    let top = ((info.point.y - rect.top) / rect.height) * 100;

    // Clamp values to prevent disappearing (1% margin)
    left = Math.max(1, Math.min(99, left));
    top = Math.max(1, Math.min(99, top));

    // Update state and key in a single batch to avoid jumping
    setCustomPositions(prev => ({
      ...prev,
      [selectedCategory]: {
        ...(prev[selectedCategory] || {}),
        [partId]: { top: `${top.toFixed(6)}%`, left: `${left.toFixed(6)}%` }
      }
    }));

    // Increment dragKey to reset the motion.div transform
    setDragKey(prev => prev + 1);
  };

  const compressImage = (base64: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setDiagramImages(prev => ({ ...prev, [selectedCategory]: compressed }));
        setImgConfigs(prev => ({ ...prev, [selectedCategory]: { scale: 1, x: 0, y: 0 } }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        // Create a unique category name based on filename or timestamp
        const fileName = file.name.split('.')[0].toUpperCase();
        const newCatName = categories.includes(fileName) ? `${fileName}_${Date.now()}` : fileName;
        
        setCustomCategories(prev => [...prev, newCatName]);
        setDiagramImages(prev => ({ ...prev, [newCatName]: compressed }));
      };
      reader.readAsDataURL(file);
    });
    alert(`${files.length} fotos adicionadas com sucesso!`);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY;
    const scaleStep = 0.1; // Increased for better feel
    const minScale = 0.5;
    const maxScale = 15;

    setImgConfigs(prev => {
      const current = prev[selectedCategory] || { scale: 1, x: 0, y: 0 };
      const newScale = delta > 0 
        ? Math.max(minScale, current.scale - scaleStep) 
        : Math.min(maxScale, current.scale + scaleStep);
      
      return {
        ...prev,
        [selectedCategory]: { ...current, scale: parseFloat(newScale.toFixed(2)) }
      };
    });
  };

  const [lastTouchPos, setLastTouchPos] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      setIsPanning(false);
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      const deltaX = e.touches[0].clientX - lastTouchPos.x;
      const deltaY = e.touches[0].clientY - lastTouchPos.y;
      
      setImgConfigs(prev => {
        const current = prev[selectedCategory] || { scale: 1, x: 0, y: 0 };
        return {
          ...prev,
          [selectedCategory]: { ...current, x: current.x + deltaX, y: current.y + deltaY }
        };
      });
      setLastTouchPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2 && lastTouchDistance !== null) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const delta = distance - lastTouchDistance;
      const scaleStep = 0.01;
      
      setImgConfigs(prev => {
        const current = prev[selectedCategory] || { scale: 1, x: 0, y: 0 };
        const newScale = Math.max(0.5, Math.min(15, current.scale + delta * scaleStep));
        return {
          ...prev,
          [selectedCategory]: { ...current, scale: parseFloat(newScale.toFixed(2)) }
        };
      });
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setLastTouchDistance(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && (e.altKey || currentConfig.scale > 1)) {
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;

    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;

    setImgConfigs(prev => {
      const current = prev[selectedCategory] || { scale: 1, x: 0, y: 0 };
      return {
        ...prev,
        [selectedCategory]: { 
          ...current, 
          x: current.x + dx / current.scale, 
          y: current.y + dy / current.scale 
        }
      };
    });

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleDeleteImage = () => {
    if (currentConfig.isLocked) {
      alert('A imagem está travada. Desbloqueie para poder excluir.');
      return;
    }
    setDiagramImages(prev => ({ ...prev, [selectedCategory]: null }));
    setImgConfigs(prev => ({ ...prev, [selectedCategory]: { scale: 1, x: 0, y: 0 } }));
    setCustomPositions(prev => {
      const next = { ...prev };
      delete next[selectedCategory];
      return next;
    });
    setIsAdjusting(false);
  };

  const filteredParts = useMemo(() => {
    const baseParts = PARTS_DATA.filter(p => p.category === selectedCategory);
    const clones = clonedParts[selectedCategory] || [];
    const all = [...baseParts, ...clones];

    return all.filter(part => {
      const matchesSearch = 
        part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm, selectedCategory, clonedParts]);

  const duplicatePart = (part: Part) => {
    const newPart: Part = {
      ...part,
      id: `${part.id}-clone-${Date.now()}`,
      itemNumber: part.itemNumber // Keep same number as requested
    };
    
    setClonedParts(prev => ({
      ...prev,
      [selectedCategory]: [...(prev[selectedCategory] || []), newPart]
    }));
    
    // Set initial position for the clone at center
    setCustomPositions(prev => ({
      ...prev,
      [selectedCategory]: {
        ...(prev[selectedCategory] || {}),
        [newPart.id]: { top: '50%', left: '50%' }
      }
    }));
    
    setFocusedPart(newPart);
  };

  const removeClone = (partId: string) => {
    setClonedParts(prev => ({
      ...prev,
      [selectedCategory]: (prev[selectedCategory] || []).filter(p => p.id !== partId)
    }));
    
    // Also remove its custom position and selection
    setCustomPositions(prev => {
      const next = { ...prev };
      if (next[selectedCategory]) {
        const categoryPos = { ...next[selectedCategory] };
        delete categoryPos[partId];
        next[selectedCategory] = categoryPos;
      }
      return next;
    });
    
    setSelectedItems(prev => prev.filter(i => i.part.id !== partId));
    setFocusedPart(null);
  };

  const toggleItem = (part: Part, type: ListType) => {
    setSelectedItems(prev => {
      const exists = prev.find(item => item.part.id === part.id && item.type === type);
      if (exists) {
        return prev.filter(item => !(item.part.id === part.id && item.type === type));
      } else {
        return [...prev, { part, type, timestamp: Date.now() }];
      }
    });
  };

  const isSelected = (partId: string, type: ListType) => {
    return selectedItems.some(item => item.part.id === partId && item.type === type);
  };

  const orderList = selectedItems.filter(item => item.type === 'order');
  const damagedList = selectedItems.filter(item => item.type === 'damaged');

  const exportToPDF = () => {
    const doc = new jsPDF();
    const t = TRANSLATIONS[reportLanguage];
    const title = activeTab === 'order' ? t.orderList : t.damageReport;
    const items = activeTab === 'order' ? orderList : damagedList;

    if (items.length === 0) return;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(242, 125, 38); // Landcros Orange
    doc.text(title, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${t.date} ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`${t.totalItems} ${items.length}`, 14, 35);
    doc.text(t.platform, 14, 40);

    // Table
    const tableData = items.map(({ part, photo }) => [
      part.partNumber,
      part.description,
      part.sheet,
      part.itemNumber,
      photo ? (reportLanguage === 'pt' ? 'Com Foto' : 'With Photo') : (reportLanguage === 'pt' ? 'Sem Foto' : 'No Photo')
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Part Number', reportLanguage === 'pt' ? 'Descrição' : 'Description', 'Sheet', 'Item', 'Status Photo']],
      body: tableData,
      headStyles: { fillColor: [242, 125, 38] },
      theme: 'grid',
    });

    // Add Photos Section if it's a damage report and has photos
    if (activeTab === 'damaged' && items.some(i => i.photo)) {
      doc.addPage();
      doc.setFontSize(18);
      doc.setTextColor(242, 125, 38);
      doc.text(t.photoEvidence, 14, 22);
      
      let currentY = 35;
      
      items.forEach((item, index) => {
        if (item.photo) {
          // Check if we need a new page (image height is approx 100)
          if (currentY > 180) {
            doc.addPage();
            currentY = 20;
          }
          
          doc.setFontSize(11);
          doc.setTextColor(0);
          doc.setFont('helvetica', 'bold');
          doc.text(`${t.item} ${item.part.itemNumber}: ${item.part.partNumber}`, 14, currentY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${t.desc} ${item.part.description}`, 14, currentY + 5);
          
          try {
            // Add image with a small border/frame feel
            doc.addImage(item.photo, 'JPEG', 14, currentY + 10, 180, 100);
            currentY += 125;
          } catch (e) {
            doc.setTextColor(255, 0, 0);
            doc.text(t.photoError, 14, currentY + 15);
            currentY += 30;
          }
        }
      });
    }

    doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
  };

  const exportTechnicalReportPDF = async () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for side-by-side
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const orange = [242, 125, 38];
    const black = [10, 10, 10];
    const t = TRANSLATIONS[reportLanguage];

    // Helper for Header
    const addHeader = (title: string) => {
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, 30, 'F');
      
      // Logo Placeholder (Orange box with white text)
      doc.setFillColor(orange[0], orange[1], orange[2]);
      doc.rect(15, 10, 45, 10, 'F');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('LANDCROS', 37.5, 17, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(title.toUpperCase(), pageWidth - 15, 17, { align: 'right' });
      
      doc.setDrawColor(orange[0], orange[1], orange[2]);
      doc.setLineWidth(1.5);
      doc.line(15, 28, pageWidth - 15, 28);
    };

    // Page 1: Technical Report Info
    addHeader(t.inspection);
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text(t.technicalReport, 15, 50);

    // Info Box
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(15, 65, pageWidth - 30, 125, 10, 10, 'FD'); // Reduced height from 135 to 125 to avoid touching bottom

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(t.inspectionInfo, 25, 80);

    const infoFields = [
      [t.model, inspectionInfo.model],
      [t.sn, inspectionInfo.sn],
      [t.tag, inspectionInfo.tag],
      [t.delivery, inspectionInfo.delivery],
      [t.customer, inspectionInfo.customer],
      [t.description, inspectionInfo.description],
      [t.machineDown, inspectionInfo.machineDown ? t.yes : t.no]
    ];

    let currentY = 95;
    doc.setFontSize(11);
    infoFields.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 25, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 75, currentY);
      currentY += 7;
    });

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(25, currentY + 4, pageWidth - 25, currentY + 4);

    currentY += 12;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(orange[0], orange[1], orange[2]);
    doc.text(t.reportData, 25, currentY);
    
    currentY += 10;
    doc.setTextColor(0, 0, 0);
    const reportData = [
      [t.inspectionDate, inspectionInfo.date],
      [t.inspectorName, inspectionInfo.inspectorName],
      [t.hourMeter, inspectionInfo.hourMeter]
    ];

    reportData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 25, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 75, currentY);
      currentY += 7;
    });

    // Pages for Photos (Side-by-Side)
    const itemsWithPhotos = selectedItems.filter(i => i.photo || i.type === 'damaged');
    
    for (const item of itemsWithPhotos) {
      doc.addPage('a4', 'l');
      addHeader(t.photos);

      // Part Info Header
      doc.setFillColor(180, 180, 180);
      doc.rect(15, 40, pageWidth / 2 - 20, 15, 'F');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`${t.partNumber} ${item.part.partNumber} ${item.part.description} ${t.qty} 1`, 20, 50);

      // Left: Inspection Photo
      if (item.photo) {
        doc.addImage(item.photo, 'JPEG', 15, 60, pageWidth / 2 - 20, 100);
      } else {
        doc.setDrawColor(200);
        doc.rect(15, 60, pageWidth / 2 - 20, 100);
        doc.setTextColor(150);
        doc.text(t.noPhoto, 40, 110);
      }

      // Right: Diagram Image
      const diagramImg = diagramImages[item.part.category];
      if (diagramImg) {
        doc.addImage(diagramImg, 'JPEG', pageWidth / 2 + 5, 60, pageWidth / 2 - 20, 100);
      } else {
        doc.setDrawColor(200);
        doc.rect(pageWidth / 2 + 5, 60, pageWidth / 2 - 20, 100);
        doc.setTextColor(150);
        doc.text(t.noDiagram, pageWidth / 2 + 30, 110);
      }

      // Descriptions
      doc.setFillColor(orange[0], orange[1], orange[2]);
      doc.rect(15, 170, pageWidth / 2 - 20, 15, 'F'); // Moved up from 175 and reduced height from 20 to 15
      doc.setFontSize(10); // Reduced font size slightly
      doc.setTextColor(255, 255, 255);
      doc.text(item.part.description.toUpperCase(), 20, 180); // Adjusted text position

      doc.setFillColor(orange[0], orange[1], orange[2]);
      doc.rect(pageWidth / 2 + 5, 170, pageWidth / 2 - 20, 15, 'F'); // Moved up from 175 and reduced height from 20 to 15
      doc.text(t.catalogRef, pageWidth / 2 + 10, 180); // Adjusted text position
    }

    // Page: Parts Table
    doc.addPage('a4', 'l');
    addHeader(t.partsTable);
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text(t.technicalReport, 15, 50);
    doc.setFontSize(18);
    doc.text(t.partsTable, 25, 65);

    const tableData = selectedItems.map((item, index) => [
      item.part.partNumber,
      item.part.description,
      '1',
      `${reportLanguage === 'pt' ? 'Foto' : 'Photo'} ${index + 1}`
    ]);

    autoTable(doc, {
      startY: 75,
      head: [['Part Number', t.partName, t.quantity, t.associatedPhoto]],
      body: tableData,
      headStyles: { fillColor: [0, 0, 0] },
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 5 }
    });

    // Page: Conclusion
    doc.addPage('a4', 'l');
    addHeader(t.conclusion);
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text(t.technicalReport, 15, 50);
    doc.setFontSize(18);
    doc.text(t.conclusion, 25, 65);

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    const conclusionText = inspectionInfo.conclusion || (reportLanguage === 'en' 
      ? `The inspection carried out on the ${inspectionInfo.model} excavator, SN:${inspectionInfo.sn} with ${inspectionInfo.hourMeter} hours of operation, showed conditions that require scheduled corrective intervention and some priority actions, mainly related to hydraulic leaks, hose integrity and fastening items.`
      : `A inspeção realizada na escavadeira ${inspectionInfo.model}, série:${inspectionInfo.sn} com ${inspectionInfo.hourMeter} horas de operação, apresentou condições que requerem intervenção corretiva programada e algumas ações prioritárias, principalmente relacionadas a vazamentos hidráulicos, integridade de mangueiras e itens de fixação.`);
    
    const splitConclusion = doc.splitTextToSize(conclusionText, pageWidth - 40);
    doc.text(splitConclusion, 25, 80);

    // Page: End
    doc.addPage('a4', 'l');
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(pageWidth / 2 - 25, 30, 50, 3, 'F');

    // Logo Center (Orange box with white text)
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(pageWidth / 2 - 50, 80, 100, 25, 'F');
    doc.setFontSize(40);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('LANDCROS', pageWidth / 2, 98, { align: 'center' });

    doc.setFontSize(24);
    doc.setTextColor(orange[0], orange[1], orange[2]);
    doc.text(t.safetyQuote1, pageWidth / 2, 130, { align: 'center' });
    doc.setFontSize(16);
    doc.text(t.safetyQuote2, pageWidth / 2, 150, { align: 'center' });
    
    doc.setFontSize(24);
    doc.text(t.end, pageWidth / 2, 180, { align: 'center' });

    doc.save(`Technical_Report_${inspectionInfo.model}_${new Date().getTime()}.pdf`);
  };

  // Exact positions for Sheet 02 - FUEL PIPINGS based on the provided image
  const getHotspotPos = (part: Part) => {
    // Check custom positions first
    if (currentCustomPos[part.id]) {
      return currentCustomPos[part.id];
    }

    if (part.category === 'FUEL PIPINGS') {
      const fuelPositions: Record<string, { top: string, left: string }> = {
        '00': { top: '56.5%', left: '42.5%' },
        '01': { top: '88.5%', left: '38.5%' },
        '02': { top: '63.5%', left: '46.5%' },
        '03': { top: '58.5%', left: '80.5%' },
        '04': { top: '58.5%', left: '24.5%' },
        '05': { top: '68.5%', left: '80.5%' },
      };
      return fuelPositions[part.itemNumber] || { top: '50%', left: '50%' };
    }
    
    // Default fallback positions for other categories
    const index = parseInt(part.itemNumber) || 0;
    const positions = [
      { top: '20%', left: '30%' }, { top: '45%', left: '25%' },
      { top: '60%', left: '40%' }, { top: '30%', left: '70%' },
      { top: '55%', left: '75%' }, { top: '75%', left: '60%' },
      { top: '15%', left: '60%' }, { top: '80%', left: '30%' },
    ];
    return positions[index % positions.length];
  };

  const diagramContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-landcros/30 bg-mining overflow-hidden">
      {/* Sidebar / Navigation */}
      <motion.div 
        initial={false}
        animate={{ x: isSidebarCollapsed ? -80 : 0 }}
        className="fixed left-0 top-0 bottom-0 w-16 md:w-20 bg-[#141414]/90 backdrop-blur-xl border-r border-white/5 hidden md:flex flex-col items-center py-8 gap-8 z-50"
      >
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center p-1 shadow-[0_0_20px_rgba(242,125,38,0.3)] overflow-hidden">
            <span className="text-[7px] font-black text-red-600 tracking-tighter leading-none">HITACHI</span>
            <div className="w-full h-[1px] bg-red-600/20 my-0.5" />
            <span className="text-[5px] font-bold text-zinc-400 uppercase tracking-widest">Original</span>
          </div>
          <span className="text-[8px] font-black text-landcros tracking-tighter uppercase">Landcros</span>
        </div>
        
        <nav className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] scrollbar-none">
          <button 
            onClick={() => setActiveTab('report')}
            className={`p-3 rounded-xl transition-all relative ${activeTab === 'report' ? 'bg-landcros/20 text-landcros' : 'text-zinc-500 hover:text-zinc-300'}`}
            title={TRANSLATIONS[reportLanguage].machineInfo}
          >
            <ClipboardList size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('inspect')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'inspect' ? 'bg-landcros/20 text-landcros' : 'text-zinc-500 hover:text-zinc-300'}`}
            title={TRANSLATIONS[reportLanguage].inspection}
          >
            <MapIcon size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('order')}
            className={`p-3 rounded-xl transition-all relative ${activeTab === 'order' ? 'bg-landcros/20 text-landcros' : 'text-zinc-500 hover:text-zinc-300'}`}
            title={TRANSLATIONS[reportLanguage].orders}
          >
            <ShoppingCart size={24} />
            {orderList.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-landcros rounded-full shadow-[0_0_10px_rgba(242,125,38,0.5)]" />}
          </button>
          <button 
            onClick={() => setActiveTab('damaged')}
            className={`p-3 rounded-xl transition-all relative ${activeTab === 'damaged' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            title={TRANSLATIONS[reportLanguage].damages}
          >
            <AlertTriangle size={24} />
            {damagedList.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}
          </button>

          <div className="w-8 h-[1px] bg-white/10 my-1 self-center" />

          <button 
            onClick={() => setShowNewProjectModal(true)}
            className="p-3 rounded-xl text-zinc-500 hover:text-landcros hover:bg-landcros/10 transition-all group"
            title={TRANSLATIONS[reportLanguage].newInspection}
          >
            <FilePlus size={24} className="group-hover:scale-110 transition-transform" />
          </button>

          {isAdmin && (
            <div className="flex flex-col gap-4">
              <div className="w-8 h-[1px] bg-white/10 my-2 self-center" />
              
              <button 
                onClick={() => setActiveTab('projects')}
                className={`p-3 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                title={TRANSLATIONS[reportLanguage].manageProjects}
              >
                <Settings size={24} />
              </button>
              
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`p-3 rounded-xl transition-all ${isEditMode ? 'bg-landcros text-white shadow-[0_0_15px_rgba(242,125,38,0.4)]' : 'text-zinc-500 hover:text-zinc-300 bg-white/5'}`}
                title={isEditMode ? TRANSLATIONS[reportLanguage].viewMode : TRANSLATIONS[reportLanguage].editMode}
              >
                {isEditMode ? <Wrench size={24} /> : <Eye size={24} />}
              </button>
            </div>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-4 pb-4">
          <button 
            onClick={() => setIsDetailsVisible(!isDetailsVisible)}
            className={`p-3 rounded-xl transition-all flex items-center justify-center ${isDetailsVisible ? 'bg-white/5 text-zinc-500' : 'bg-landcros/20 text-landcros'}`}
            title={isDetailsVisible ? TRANSLATIONS[reportLanguage].hideDetails : TRANSLATIONS[reportLanguage].showDetails}
          >
            {isDetailsVisible ? <List size={24} /> : <Maximize2 size={24} />}
          </button>
          
          <button 
            onClick={toggleAdmin}
            className={`p-3 rounded-xl transition-all flex items-center justify-center ${isAdmin ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-zinc-600 hover:text-zinc-400'}`}
            title={isAdmin ? TRANSLATIONS[reportLanguage].lockSettings : TRANSLATIONS[reportLanguage].unlockDevMode}
          >
            {isAdmin ? <ShieldCheck size={24} /> : <Shield size={24} />}
          </button>
          <div className="px-2 text-center">
            <p className="text-[6px] text-zinc-600 uppercase font-bold leading-tight">{TRANSLATIONS[reportLanguage].localSaveWarning}</p>
          </div>
          <button 
            onClick={() => {
              if (confirm(reportLanguage === 'pt' ? 'Deseja limpar todos os dados salvos? Isso removerá imagens e configurações.' : 'Do you want to clear all saved data? This will remove images and configurations.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="p-3 text-zinc-600 hover:text-red-500 transition-colors"
            title={TRANSLATIONS[reportLanguage].clearAll}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#141414]/95 backdrop-blur-2xl border-t border-white/5 flex md:hidden items-center justify-around py-3 px-4 z-50">
        <button 
          onClick={() => setActiveTab('report')}
          className={`p-2 rounded-lg transition-all ${activeTab === 'report' ? 'text-landcros' : 'text-zinc-500'}`}
        >
          <ClipboardList size={22} />
        </button>
        <button 
          onClick={() => setActiveTab('inspect')}
          className={`p-2 rounded-lg transition-all ${activeTab === 'inspect' ? 'text-landcros' : 'text-zinc-500'}`}
        >
          <MapIcon size={22} />
        </button>
        <button 
          onClick={() => setActiveTab('order')}
          className={`p-2 rounded-lg transition-all relative ${activeTab === 'order' ? 'text-landcros' : 'text-zinc-500'}`}
        >
          <ShoppingCart size={22} />
          {orderList.length > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-landcros rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('damaged')}
          className={`p-2 rounded-lg transition-all relative ${activeTab === 'damaged' ? 'text-white' : 'text-zinc-500'}`}
        >
          <AlertTriangle size={22} />
          {damagedList.length > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />}
        </button>
        <button 
          onClick={toggleAdmin}
          className={`p-2 rounded-lg transition-all ${isAdmin ? 'text-green-500' : 'text-zinc-500'}`}
        >
          {isAdmin ? <ShieldCheck size={22} /> : <Shield size={22} />}
        </button>
      </div>

      <main className={`flex-1 h-screen flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'pl-0' : 'pl-0 md:pl-16 lg:pl-20'} pb-16 md:pb-0`}>
        {/* New Project Confirmation Modal */}
        <AnimatePresence>
          {showNewProjectModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#141414] border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FilePlus size={32} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Nova Inspeção</h3>
                  <p className="text-zinc-500 text-xs">Deseja iniciar um novo trabalho? O backup da inspeção atual será baixado automaticamente.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={startNewProject}
                    className="w-full py-4 rounded-xl bg-red-500 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    Confirmar e Iniciar
                  </button>
                  <button 
                    onClick={() => setShowNewProjectModal(false)}
                    className="w-full py-4 rounded-xl bg-white/5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PIN Modal */}
        <AnimatePresence>
          {showPinModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#141414] border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-landcros/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield size={32} className="text-landcros" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">{TRANSLATIONS[reportLanguage].restrictedAccess}</h3>
                  <p className="text-zinc-500 text-xs">{TRANSLATIONS[reportLanguage].enterPin}</p>
                </div>

                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <input 
                    autoFocus
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-2xl font-mono tracking-[0.5em] text-landcros outline-none focus:border-landcros transition-all"
                    placeholder="••••"
                  />
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowPinModal(false)}
                      className="flex-1 py-3 rounded-xl bg-white/5 text-zinc-400 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                    >
                      {TRANSLATIONS[reportLanguage].cancel}
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-landcros text-white font-bold uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-landcros/20"
                    >
                      {TRANSLATIONS[reportLanguage].enter}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'report' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-mining">
            <div className="max-w-4xl mx-auto space-y-8">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <span className="text-[9px] font-mono text-landcros font-bold uppercase tracking-widest">{TRANSLATIONS[reportLanguage].technicalReport}</span>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mt-1 uppercase italic">{TRANSLATIONS[reportLanguage].machineInfo}</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
                    <button 
                      onClick={() => {
                        setReportLanguage('pt');
                        localStorage.setItem('reportLanguage', 'pt');
                      }}
                      className={`flex-1 sm:px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${reportLanguage === 'pt' ? 'bg-landcros text-white shadow-lg shadow-landcros/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      PT
                    </button>
                    <button 
                      onClick={() => {
                        setReportLanguage('en');
                        localStorage.setItem('reportLanguage', 'en');
                      }}
                      className={`flex-1 sm:px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${reportLanguage === 'en' ? 'bg-landcros text-white shadow-lg shadow-landcros/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      EN
                    </button>
                  </div>
                  <button 
                    onClick={exportTechnicalReportPDF}
                    className="flex items-center justify-center gap-2 bg-landcros hover:bg-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl shadow-landcros/20 w-full sm:w-auto"
                  >
                    <Download size={18} />
                    {TRANSLATIONS[reportLanguage].generatePDF}
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-3xl space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Info size={20} className="text-landcros" />
                    {TRANSLATIONS[reportLanguage].machineData}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].selectMachine}</label>
                      <select 
                        value={inspectionInfo.tag}
                        onChange={(e) => handleMachineChange(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#141414]">{TRANSLATIONS[reportLanguage].selectMachinePlaceholder}</option>
                        {MACHINE_DATABASE.map(m => (
                          <option key={m.tag} value={m.tag} className="bg-[#141414]">
                            {m.tag}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].tag.replace(':', '')}</label>
                      <input 
                        type="text" 
                        value={inspectionInfo.tag}
                        onChange={(e) => setInspectionInfo(prev => ({ ...prev, tag: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].model.replace(':', '')}</label>
                      <input 
                        type="text" 
                        value={inspectionInfo.model}
                        onChange={(e) => setInspectionInfo(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].sn.replace(':', '')} (SN)</label>
                      <input 
                        type="text" 
                        value={inspectionInfo.sn}
                        onChange={(e) => setInspectionInfo(prev => ({ ...prev, sn: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].delivery.replace(':', '')}</label>
                      <input 
                        type="text" 
                        value={inspectionInfo.delivery}
                        onChange={(e) => setInspectionInfo(prev => ({ ...prev, delivery: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].customer.replace(':', '')}</label>
                    <input 
                      type="text" 
                      value={inspectionInfo.customer}
                      onChange={(e) => setInspectionInfo(prev => ({ ...prev, customer: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].inspectionDescription}</label>
                    <input 
                      type="text" 
                      value={inspectionInfo.description}
                      onChange={(e) => setInspectionInfo(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-xs font-bold text-zinc-300">{TRANSLATIONS[reportLanguage].machineDownQuestion}</span>
                    <button 
                      onClick={() => setInspectionInfo(prev => ({ ...prev, machineDown: !prev.machineDown }))}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        inspectionInfo.machineDown ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 text-zinc-500'
                      }`}
                    >
                      {inspectionInfo.machineDown ? TRANSLATIONS[reportLanguage].yes : TRANSLATIONS[reportLanguage].no}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-8 rounded-3xl space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck size={20} className="text-landcros" />
                      {TRANSLATIONS[reportLanguage].inspectorData}
                    </h3>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].inspectorName.replace(':', '')}</label>
                      <input 
                        type="text" 
                        value={inspectionInfo.inspectorName}
                        onChange={(e) => setInspectionInfo(prev => ({ ...prev, inspectorName: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].hourMeter.replace(':', '')}</label>
                        <input 
                          type="text" 
                          value={inspectionInfo.hourMeter}
                          onChange={(e) => setInspectionInfo(prev => ({ ...prev, hourMeter: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{TRANSLATIONS[reportLanguage].date.replace(':', '')}</label>
                        <input 
                          type="date" 
                          value={inspectionInfo.date}
                          onChange={(e) => setInspectionInfo(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-8 rounded-3xl space-y-4">
                    <h3 className="text-lg font-bold text-white">{TRANSLATIONS[reportLanguage].reportConclusion}</h3>
                    <textarea 
                      value={inspectionInfo.conclusion}
                      onChange={(e) => setInspectionInfo(prev => ({ ...prev, conclusion: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-landcros outline-none transition-all min-h-[150px] resize-none"
                      placeholder={TRANSLATIONS[reportLanguage].conclusionPlaceholder}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-mining">
            <div className="max-w-2xl mx-auto space-y-8">
              <header>
                <span className="text-[9px] font-mono text-landcros font-bold uppercase tracking-widest">Gerenciador de Inspeções</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mt-1 uppercase italic">Backup & Projetos</h2>
              </header>

              <div className="grid gap-6">
                {/* Current Project Info */}
                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Nome da Inspeção Atual</label>
                    <input 
                      type="text" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold focus:border-landcros outline-none transition-all"
                      placeholder="Ex: Escavadeira ZX210 - Cliente X"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={exportProject}
                      className="flex-1 flex items-center justify-center gap-2 bg-landcros hover:bg-landcros/80 text-white p-4 rounded-xl font-bold transition-all shadow-lg shadow-landcros/20"
                    >
                      <Save size={18} />
                      Baixar Backup (.landcros)
                    </button>
                    <label className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl font-bold transition-all border border-white/10 cursor-pointer">
                      <Upload size={18} />
                      Importar Backup
                      <input type="file" accept=".landcros" onChange={importProject} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">Configurações de Acesso</h3>
                  <p className="text-zinc-500 text-xs mb-4">Altere a senha de desenvolvedor para proteger suas configurações.</p>
                  <div className="flex gap-3">
                    <input 
                      type="password" 
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white font-mono focus:border-landcros outline-none transition-all"
                      placeholder="Nova Senha"
                    />
                    <button 
                      onClick={() => alert('Senha salva com sucesso!')}
                      className="bg-white/5 hover:bg-white/10 text-white px-6 rounded-xl font-bold border border-white/10 transition-all"
                    >
                      Salvar
                    </button>
                  </div>
                </div>

                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">Adicionar Novas Sheets (Fotos)</h3>
                  <p className="text-zinc-500 text-xs mb-4">Crie novas categorias para carregar mais fotos de diagramas ou manuais.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block text-zinc-400">Adicionar uma por uma</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          id="new-cat-input"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-landcros outline-none transition-all text-sm"
                          placeholder="Nome da Sheet"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val && !categories.includes(val)) {
                                setCustomCategories(prev => [...prev, val]);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <button 
                          onClick={() => {
                            const input = document.getElementById('new-cat-input') as HTMLInputElement;
                            const val = input.value.trim();
                            if (val && !categories.includes(val)) {
                              setCustomCategories(prev => [...prev, val]);
                              input.value = '';
                            }
                          }}
                          className="bg-landcros text-white px-4 rounded-xl font-bold hover:bg-orange-600 transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block text-zinc-400">Adicionar várias fotos de uma vez</label>
                      <label className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl font-bold transition-all border border-white/10 cursor-pointer text-sm h-[46px]">
                        <Upload size={18} />
                        Selecionar Múltiplas Fotos
                        <input type="file" multiple accept="image/*" onChange={handleBulkImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                  
                  {customCategories.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sheets Customizadas</p>
                      <div className="flex flex-wrap gap-2">
                        {customCategories.map(cat => (
                          <div key={cat} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white">
                            {cat}
                            <button 
                              onClick={() => setCustomCategories(prev => prev.filter(c => c !== cat))}
                              className="text-zinc-500 hover:text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">Finalizar Configuração</h3>
                  <p className="text-zinc-500 text-xs mb-6">Bloqueia o Modo Desenvolvedor e volta para a tela de inspeção para uso da equipe.</p>
                  <button 
                    onClick={toggleAdmin}
                    className="w-full flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 p-4 rounded-xl font-bold transition-all border border-green-500/20"
                  >
                    <ShieldCheck size={18} />
                    Bloquear e Sair do Modo Desenvolvedor
                  </button>
                </div>

                {/* New Project */}
                <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">Iniciar Nova Inspeção</h3>
                  <p className="text-zinc-500 text-xs mb-6">Limpa todos os dados atuais e bloqueia o Modo Desenvolvedor para uma nova inspeção segura.</p>
                  <button 
                    onClick={() => setShowNewProjectModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 p-4 rounded-xl font-bold transition-all border border-white/10"
                  >
                    <FilePlus size={18} />
                    Criar Nova Inspeção em Branco
                  </button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex gap-4">
                  <Info className="text-blue-500 shrink-0" size={24} />
                  <div className="space-y-2">
                    <h4 className="text-blue-500 font-bold text-sm">Como funciona o salvamento?</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      O app salva tudo automaticamente no seu navegador. Ao "Baixar Backup", você gera um arquivo que contém todas as fotos e marcações. Você pode usar esse arquivo para restaurar seu trabalho em outro computador ou para arquivar inspeções antigas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inspect' && (
          <>
            {/* Top Navigation: Category/Sheet Selector */}
            <div className="bg-[#141414]/80 backdrop-blur-md border-b border-white/5 p-3 md:p-4 flex items-center gap-2 md:gap-4 sticky top-0 z-40">
              <div className="flex items-center gap-2 pr-2 md:pr-4 border-r border-white/10 shrink-0">
                <div className="w-8 h-8 bg-landcros rounded-lg flex items-center justify-center text-white">
                  <Package size={16} />
                </div>
                <div className="hidden lg:block">
                  <h1 className="text-[10px] font-black uppercase tracking-tighter leading-none">Connect</h1>
                  <p className="text-[8px] font-bold text-landcros uppercase tracking-widest">Insight</p>
                </div>
              </div>

              <div className="flex flex-col pr-2 md:pr-4 border-r border-white/10 shrink-0">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Inspeção</span>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[80px] md:max-w-[120px]">{projectName}</p>
                  {isAdmin && (
                    <span className="text-[7px] bg-green-500 text-white px-1 rounded font-black uppercase tracking-tighter animate-pulse">ADMIN</span>
                  )}
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden relative group">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setFocusedPart(null); }}
                      className={`whitespace-nowrap px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${
                        selectedCategory === cat 
                          ? 'bg-landcros text-white shadow-[0_0_20px_rgba(242,125,38,0.2)]' 
                          : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Side: Visual Diagram Area */}
              <div className="flex-1 bg-transparent relative overflow-hidden flex flex-col">
                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                  <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">
                    {selectedCategory}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Diagrama Técnico</p>
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <p className={`text-[8px] font-bold uppercase tracking-widest ${saveStatus === 'error' ? 'text-red-500' : 'text-zinc-600'}`}>
                      {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'error' ? 'Memória Cheia!' : 'Sincronizado'}
                    </p>
                  </div>
                </div>

                <div className="absolute top-6 right-6 z-10 flex gap-2">
                  <button 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className={`p-2 rounded-lg transition-all border ${isSidebarCollapsed ? 'bg-landcros text-white border-landcros' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                    title={isSidebarCollapsed ? "Sair da Tela Cheia" : "Tela Cheia"}
                  >
                    <Maximize2 size={14} />
                  </button>

                  <button 
                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                    className={`p-2 rounded-lg transition-all border ${isFiltersVisible ? 'bg-landcros text-white border-landcros' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                    title="Ajustes de Cor"
                  >
                    <Palette size={14} />
                  </button>

                  <button 
                    onClick={() => setIsBlueprintMode(!isBlueprintMode)}
                    className={`p-2 rounded-lg transition-all border ${isBlueprintMode ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                    title="Modo Blueprint (Remover Fundo)"
                  >
                    <Lightbulb size={14} />
                  </button>
                  
                  {isEditMode && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-2"
                    >
                      {currentImg && (
                        <button 
                          onClick={handleDeleteImage}
                          className={`p-2 rounded-lg transition-all border ${currentConfig.isLocked ? 'bg-zinc-800/50 text-zinc-600 border-white/5 cursor-not-allowed' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20'}`}
                          title={currentConfig.isLocked ? "Imagem Travada" : "Excluir Imagem"}
                          disabled={currentConfig.isLocked}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => setImgConfigs(prev => ({
                          ...prev,
                          [selectedCategory]: { ...currentConfig, isLocked: !currentConfig.isLocked }
                        }))}
                        className={`p-2 rounded-lg transition-all border ${currentConfig.isLocked ? 'bg-landcros text-white border-landcros' : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10'}`}
                        title={currentConfig.isLocked ? "Desbloquear Imagem" : "Fixar Imagem"}
                      >
                        {currentConfig.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                      <button 
                        onClick={() => !currentConfig.isLocked && setIsAdjusting(!isAdjusting)}
                        disabled={currentConfig.isLocked}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${currentConfig.isLocked ? 'opacity-50 cursor-not-allowed bg-white/5 text-zinc-600' : isAdjusting ? 'bg-landcros text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                      >
                        {isAdjusting ? 'Pronto' : 'Ajustar Imagem'}
                      </button>
                      <label className={`cursor-pointer bg-landcros/10 hover:bg-landcros/20 text-landcros px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-landcros/20 ${currentConfig.isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Download size={12} className="rotate-180" />
                        Imagem
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={currentConfig.isLocked} />
                      </label>
                    </motion.div>
                  )}

                  <button 
                    onClick={() => setViewMode(viewMode === 'visual' ? 'list' : 'visual')}
                    className="px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-white/5 text-zinc-400 hover:bg-white/10"
                  >
                    {viewMode === 'visual' ? 'Ver Lista' : 'Ver Diagrama'}
                  </button>
                </div>

                {/* Adjustment Controls - Draggable & Collapsible */}
                <AnimatePresence>
                  {isFiltersVisible && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="absolute top-24 left-6 z-50 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-[260px] overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-landcros">Ajustes de Cor</span>
                        <button 
                          onClick={() => setIsFiltersVisible(false)}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-zinc-400"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="p-6 flex flex-col gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Sun size={12} className="text-zinc-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Brilho</span>
                              </div>
                              <span className="text-[10px] font-mono text-landcros">{currentFilters.brightness}%</span>
                            </div>
                            <input 
                              type="range" min="0" max="200" step="1" 
                              value={currentFilters.brightness} 
                              onChange={(e) => setImgFilters(prev => ({ 
                                ...prev, 
                                [selectedCategory]: { ...currentFilters, brightness: parseInt(e.target.value) } 
                              }))}
                              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Contrast size={12} className="text-zinc-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Contraste</span>
                              </div>
                              <span className="text-[10px] font-mono text-landcros">{currentFilters.contrast}%</span>
                            </div>
                            <input 
                              type="range" min="0" max="200" step="1" 
                              value={currentFilters.contrast} 
                              onChange={(e) => setImgFilters(prev => ({ 
                                ...prev, 
                                [selectedCategory]: { ...currentFilters, contrast: parseInt(e.target.value) } 
                              }))}
                              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Droplets size={12} className="text-zinc-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Saturação (G&P)</span>
                              </div>
                              <span className="text-[10px] font-mono text-landcros">{currentFilters.grayscale}%</span>
                            </div>
                            <input 
                              type="range" min="0" max="100" step="1" 
                              value={currentFilters.grayscale} 
                              onChange={(e) => setImgFilters(prev => ({ 
                                ...prev, 
                                [selectedCategory]: { ...currentFilters, grayscale: parseInt(e.target.value) } 
                              }))}
                              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => setImgFilters(prev => ({ ...prev, [selectedCategory]: { brightness: 100, contrast: 100, grayscale: 0 } }))}
                          className="w-full py-2.5 rounded-xl bg-white/5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                        >
                          Resetar Cores
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {isAdjusting && (
                    <motion.div 
                      drag
                      dragMomentum={false}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        width: isPanelMinimized ? '48px' : '260px',
                        height: isPanelMinimized ? '48px' : 'auto'
                      }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute top-24 left-6 z-50 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden cursor-grab active:cursor-grabbing"
                    >
                      <div className={`flex items-center justify-between p-4 ${isPanelMinimized ? 'h-full justify-center' : 'border-b border-white/5'}`}>
                        {!isPanelMinimized && (
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-landcros">Calibração</span>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setIsPanelMinimized(!isPanelMinimized); }}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-zinc-400"
                        >
                          {isPanelMinimized ? <ChevronRight size={18} /> : <X size={18} />}
                        </button>
                      </div>

                      {!isPanelMinimized && (
                        <div className="p-6 flex flex-col gap-6">
                          <p className="text-[9px] text-zinc-500">Arraste este painel ou os números para ajustar.</p>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                <span>Zoom</span>
                                <span className="text-landcros">{currentConfig.scale.toFixed(2)}x</span>
                              </div>
                              <input 
                                type="range" min="0.5" max="3" step="0.01" 
                                value={currentConfig.scale} 
                                onChange={(e) => setImgConfigs(prev => ({ 
                                  ...prev, 
                                  [selectedCategory]: { ...currentConfig, scale: parseFloat(e.target.value) } 
                                }))}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                              />
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Posição X</span>
                              <input 
                                type="range" min="-400" max="400" step="1" 
                                value={currentConfig.x} 
                                onChange={(e) => setImgConfigs(prev => ({ 
                                  ...prev, 
                                  [selectedCategory]: { ...currentConfig, x: parseInt(e.target.value) } 
                                }))}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                              />
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Posição Y</span>
                              <input 
                                type="range" min="-400" max="400" step="1" 
                                value={currentConfig.y} 
                                onChange={(e) => setImgConfigs(prev => ({ 
                                  ...prev, 
                                  [selectedCategory]: { ...currentConfig, y: parseInt(e.target.value) } 
                                }))}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                              />
                            </div>

                            <div className="space-y-2 pt-2 border-t border-white/5">
                              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                <span>Tamanho dos Números</span>
                                <span className="text-landcros">{hotspotSize}px</span>
                              </div>
                              <input 
                                type="range" min="20" max="80" step="1" 
                                value={hotspotSize} 
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setHotspotSize(val);
                                  localStorage.setItem('hotspotSize', val.toString());
                                }}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-landcros"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 pt-2">
                            <button 
                              onClick={saveCurrentAsMaster}
                              className="w-full py-3 rounded-xl bg-landcros text-[10px] font-black uppercase tracking-widest text-white hover:bg-landcros/90 transition-all shadow-lg shadow-landcros/20 flex items-center justify-center gap-2 mb-2"
                            >
                              <Save size={14} />
                              Salvar como Configuração Mestre
                            </button>
                            <button 
                              onClick={handleResetZoom}
                              className="w-full py-2.5 rounded-xl bg-white/5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                            >
                              Resetar para Mestre
                            </button>
                            <button 
                              onClick={() => setImgConfigs(prev => ({ ...prev, [selectedCategory]: { scale: 1, x: 0, y: 0 } }))}
                              className="w-full py-2.5 rounded-xl bg-white/5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                            >
                              Resetar para 1:1
                            </button>
                            <button 
                              onClick={() => setCustomPositions(prev => {
                                const next = { ...prev };
                                delete next[selectedCategory];
                                return next;
                              })}
                              className="w-full py-2.5 rounded-xl bg-white/5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                            >
                              Resetar Números
                            </button>
                            <button 
                              onClick={() => setIsAdjusting(false)}
                              className="w-full py-3 rounded-xl bg-landcros text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(242,125,38,0.2)]"
                            >
                              Concluir
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                    {/* Diagram Simulator */}
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[#050505]">
                      <div 
                        ref={diagramContainerRef}
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className={`relative w-full h-full transition-all duration-500 ease-in-out overflow-hidden group flex items-center justify-center ${isPanning ? 'cursor-grabbing' : currentConfig.scale > 1 ? 'cursor-grab' : ''}`}
                      >
                        {/* Enhanced Dotted Grid */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" 
                          style={{ 
                            backgroundImage: 'radial-gradient(circle, #F27D26 1px, transparent 1.5px)', 
                            backgroundSize: '40px 40px' 
                          }} 
                        />
                        
                        {/* Reset Zoom Button */}
                        <AnimatePresence>
                          {(currentConfig.scale !== (savedConfigs[selectedCategory]?.scale || 1) || 
                            currentConfig.x !== (savedConfigs[selectedCategory]?.x || 0) || 
                            currentConfig.y !== (savedConfigs[selectedCategory]?.y || 0)) && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.8, y: 20 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResetZoom();
                              }}
                              className="absolute bottom-6 right-6 z-40 p-4 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl text-landcros hover:bg-landcros hover:text-white transition-all shadow-2xl group flex items-center gap-2"
                              title="Resetar para Configuração Mestre"
                            >
                              <RotateCcw size={18} className="group-hover:rotate-[-45deg] transition-transform" />
                              <span className="text-[10px] font-black uppercase tracking-widest pr-1">Configuração Mestre</span>
                            </motion.button>
                          )}
                        </AnimatePresence>

                        {/* Fixed Aspect Ratio Container to prevent hotspot displacement */}
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div 
                            ref={innerContainerRef}
                            className={`relative flex items-center justify-center`}
                            style={{ 
                              aspectRatio: '16/9',
                              width: '100%',
                              height: 'auto',
                              maxWidth: '100%',
                              maxHeight: '100%',
                              transform: `scale(${currentConfig.scale}) translate(${currentConfig.x}px, ${currentConfig.y}px)`,
                              transformOrigin: 'center center'
                            }}
                          >
                            {currentImg ? (
                              <img 
                                src={currentImg} 
                                alt="Diagrama" 
                                className="w-full h-full object-fill" 
                                style={{ 
                                  filter: isBlueprintMode 
                                    ? `invert(0.9) contrast(1.3) brightness(1.1) brightness(${currentFilters.brightness}%) contrast(${currentFilters.contrast}%) grayscale(${currentFilters.grayscale}%)` 
                                    : `brightness(${currentFilters.brightness}%) contrast(${currentFilters.contrast}%) grayscale(${currentFilters.grayscale}%)`,
                                  mixBlendMode: isBlueprintMode ? 'screen' : 'normal',
                                  opacity: isBlueprintMode ? 0.9 : 1
                                }}
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none p-12 text-center">
                                <MapIcon size={48} className="mb-4" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Carregue a imagem da Sheet correspondente</p>
                              </div>
                            )}

                            {viewMode === 'visual' ? (
                              filteredParts.map((part) => {
                                const pos = getHotspotPos(part);
                                const isFocused = focusedPart?.id === part.id;
                                const hasOrder = isSelected(part.id, 'order');
                                const hasDamage = isSelected(part.id, 'damaged');
                                const isCustom = !!currentCustomPos[part.id];

                                return (
                                  <motion.div 
                                    key={`${part.id}-${isAdjusting}-${dragKey}`} // Key change forces re-render to clear internal drag state
                                    drag={isAdjusting}
                                    dragMomentum={false}
                                    onDragEnd={(_, info) => handleDragEnd(part.id, info)}
                                    className={`absolute z-20 ${isAdjusting ? 'cursor-move' : ''}`} 
                                    style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                                  >
                                    <AnimatePresence>
                                      {(hasOrder || hasDamage || isFocused) && (
                                        <motion.div
                                          initial={{ scale: 0.8, opacity: 0 }}
                                          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                                          transition={{ duration: 2.5, repeat: Infinity }}
                                          className={`absolute inset-0 rounded-full blur-sm ${isFocused ? 'bg-white' : hasDamage ? 'bg-red-500' : 'bg-landcros'}`}
                                        />
                                      )}
                                    </AnimatePresence>
                                    
                                    <div className="relative group/hotspot">
                                      <motion.button
                                        onClick={() => !isAdjusting && setFocusedPart(part)}
                                        className={`relative rounded-full flex items-center justify-center font-mono font-bold transition-all ${
                                          isFocused ? 'bg-white text-black scale-110' : hasDamage ? 'bg-red-500 text-white' : hasOrder ? 'bg-landcros text-white' : 'bg-zinc-800 text-zinc-400'
                                        } ${isAdjusting ? 'pointer-events-none' : ''}`}
                                        style={{ 
                                          width: `${hotspotSize}px`, 
                                          height: `${hotspotSize}px`,
                                          fontSize: `${Math.max(8, hotspotSize / 3.5)}px`
                                        }}
                                      >
                                        {part.itemNumber}
                                      </motion.button>

                                      {/* Individual Reset Button */}
                                      {isAdmin && isAdjusting && isCustom && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setCustomPositions(prev => {
                                              const next = { ...prev };
                                              const catPos = { ...next[selectedCategory] };
                                              delete catPos[part.id];
                                              next[selectedCategory] = catPos;
                                              return next;
                                            });
                                          }}
                                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors pointer-events-auto z-30"
                                          title="Resetar posição deste número"
                                        >
                                          <X size={10} strokeWidth={3} />
                                        </button>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })
                            ) : (
                              <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl z-30 overflow-y-auto p-6 md:p-8">
                                <div className="max-w-2xl mx-auto space-y-4">
                                  <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Lista de Peças: {selectedCategory}</h3>
                                    <button onClick={() => setViewMode('visual')} className="text-landcros text-[10px] font-bold uppercase tracking-widest hover:underline">Voltar ao Diagrama</button>
                                  </div>
                                  <div className="grid grid-cols-1 gap-2">
                                    {filteredParts.map(part => (
                                      <button
                                        key={part.id}
                                        onClick={() => { setFocusedPart(part); setViewMode('visual'); }}
                                        className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group text-left"
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 font-mono font-bold group-hover:bg-landcros group-hover:text-white transition-colors">
                                            {part.itemNumber}
                                          </div>
                                          <div>
                                            <p className="text-white font-bold text-sm tracking-tight">{part.partNumber}</p>
                                            <p className="text-zinc-500 text-[10px] font-mono italic">{part.description}</p>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          {isSelected(part.id, 'order') && <ShoppingCart size={14} className="text-landcros" />}
                                          {isSelected(part.id, 'damaged') && <AlertTriangle size={14} className="text-red-500" />}
                                          <ChevronRight size={16} className="text-zinc-700 group-hover:text-white transition-colors" />
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

              {/* Right Side: Details Panel */}
              <AnimatePresence>
                {isDetailsVisible && (
                  <motion.div 
                    initial={{ x: 350, opacity: 0 }}
                    animate={{ 
                      x: 0, 
                      opacity: 1,
                      y: window.innerWidth < 768 ? 0 : 0
                    }}
                    exit={{ x: 350, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed md:relative inset-x-0 bottom-0 md:inset-auto h-[70vh] md:h-full w-full md:w-[350px] bg-[#141414]/95 md:bg-[#141414]/90 backdrop-blur-2xl md:backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 md:border-white/5 flex flex-col shrink-0 z-[60] md:z-30 rounded-t-[32px] md:rounded-none shadow-[0_-20px_50px_rgba(0,0,0,0.5)] md:shadow-none"
                  >
                    <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-3 mb-1 md:hidden" />
                    <div className="p-6 flex-1 overflow-y-auto pb-24 md:pb-6">
                      <AnimatePresence mode="wait">
                        {focusedPart ? (
                          <motion.div key={focusedPart.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] font-mono text-landcros font-bold uppercase tracking-widest">Detalhes da Peça</span>
                                <h3 className="text-2xl font-black tracking-tighter text-white mt-1 leading-tight">{focusedPart.partNumber}</h3>
                                <p className="text-zinc-500 font-mono text-xs mt-2 italic">{focusedPart.description}</p>
                              </div>
                              <button 
                                onClick={() => setFocusedPart(null)}
                                className="md:hidden p-2 bg-white/5 rounded-full text-zinc-400"
                              >
                                <X size={20} />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-[8px] text-zinc-500 uppercase font-bold">Sheet</span>
                                <p className="text-sm font-bold text-white">{focusedPart.sheet}</p>
                              </div>
                              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-[8px] text-zinc-500 uppercase font-bold">Item</span>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-white">{focusedPart.itemNumber}</p>
                                  {focusedPart.id.includes('-clone-') && (
                                    <span className="text-[7px] bg-landcros/20 text-landcros px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Cópia</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {isAdmin && (
                              <div className="space-y-2 pt-2">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => duplicatePart(focusedPart)}
                                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 text-[10px] font-bold uppercase tracking-widest"
                                    title="Criar outra instância desta peça no desenho"
                                  >
                                    <Copy size={14} />
                                    Duplicar
                                  </button>
                                  {focusedPart.id.includes('-clone-') && (
                                    <button
                                      onClick={() => removeClone(focusedPart.id)}
                                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/20 text-[10px] font-bold uppercase tracking-widest"
                                    >
                                      <Trash2 size={14} />
                                      Remover
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="space-y-2 pt-2">
                              <button
                                onClick={() => toggleItem(focusedPart, 'order')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all font-bold text-xs ${
                                  isSelected(focusedPart.id, 'order') ? 'bg-landcros text-white' : 'bg-white/5 text-white hover:bg-white/10'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <ShoppingCart size={16} />
                                  <span>Adicionar ao Pedido</span>
                                </div>
                                {isSelected(focusedPart.id, 'order') && <CheckCircle2 size={16} />}
                              </button>

                              <button
                                onClick={() => toggleItem(focusedPart, 'damaged')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all font-bold text-xs ${
                                  isSelected(focusedPart.id, 'damaged') ? 'bg-red-500 text-white' : 'bg-white/5 text-white hover:bg-white/10'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <AlertTriangle size={16} />
                                  <span>Marcar como Avariado</span>
                                </div>
                                {isSelected(focusedPart.id, 'damaged') && <CheckCircle2 size={16} />}
                              </button>

                              {(isSelected(focusedPart.id, 'order') || isSelected(focusedPart.id, 'damaged')) && (
                                <div className="space-y-3 mt-6">
                                  <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-widest">Evidências Fotográficas</span>
                                  
                                  <div className="relative aspect-video bg-black/40 rounded-2xl border border-white/5 overflow-hidden group/photo">
                                    {selectedItems.find(i => i.part.id === focusedPart.id)?.photo ? (
                                      <>
                                        <img 
                                          src={selectedItems.find(i => i.part.id === focusedPart.id)?.photo} 
                                          className="w-full h-full object-cover"
                                          alt="Evidência"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                          <button 
                                            onClick={() => setIsCameraOpen(true)}
                                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                                            title="Tirar nova foto"
                                          >
                                            <Camera size={20} />
                                          </button>
                                          
                                          <label className="p-3 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-all" title="Escolher da galeria">
                                            <Upload size={20} className="text-white" />
                                            <input 
                                              type="file" 
                                              accept="image/*" 
                                              className="hidden" 
                                              onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                  const reader = new FileReader();
                                                  reader.onload = async () => {
                                                    const compressed = await compressImage(reader.result as string, 800, 0.6);
                                                    setSelectedItems(prev => prev.map(item => 
                                                      item.part.id === focusedPart.id ? { ...item, photo: compressed } : item
                                                    ));
                                                  };
                                                  reader.readAsDataURL(file);
                                                }
                                              }}
                                            />
                                          </label>
                                          
                                          <button 
                                            onClick={() => setSelectedItems(prev => prev.map(item => 
                                              item.part.id === focusedPart.id ? { ...item, photo: undefined } : item
                                            ))}
                                            className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-all"
                                            title="Remover foto"
                                          >
                                            <Trash2 size={20} className="text-red-500" />
                                          </button>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                        <div className="flex gap-4">
                                          <button 
                                            onClick={() => setIsCameraOpen(true)}
                                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
                                          >
                                            <Camera size={24} className="text-landcros mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Câmera</span>
                                          </button>
                                          
                                          <label className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 cursor-pointer group">
                                            <Upload size={24} className="text-zinc-400 mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Galeria</span>
                                            <input 
                                              type="file" 
                                              accept="image/*" 
                                              className="hidden" 
                                              onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                  const reader = new FileReader();
                                                  reader.onload = async () => {
                                                    const compressed = await compressImage(reader.result as string, 800, 0.6);
                                                    setSelectedItems(prev => prev.map(item => 
                                                      item.part.id === focusedPart.id ? { ...item, photo: compressed } : item
                                                    ));
                                                  };
                                                  reader.readAsDataURL(file);
                                                }
                                              }}
                                            />
                                          </label>
                                        </div>
                                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Adicionar Evidência</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                            <Info size={32} />
                            <p className="text-xs font-medium uppercase tracking-widest">{TRANSLATIONS[reportLanguage].selectItemOnDiagram.split(' ').slice(0, 2).join(' ')}<br/>{TRANSLATIONS[reportLanguage].selectItemOnDiagram.split(' ').slice(2).join(' ')}</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="p-4 bg-black/20 border-t border-white/5 flex justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>{TRANSLATIONS[reportLanguage].orders}: {orderList.length}</span>
                      <span>{TRANSLATIONS[reportLanguage].damages}: {damagedList.length}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {(activeTab === 'order' || activeTab === 'damaged') && (
          <div className="p-4 md:p-12 max-w-4xl mx-auto space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <button 
                  onClick={() => setActiveTab('inspect')}
                  className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4"
                >
                  <ArrowLeft size={14} /> {TRANSLATIONS[reportLanguage].backToInspect}
                </button>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white italic uppercase">
                  {activeTab === 'order' ? TRANSLATIONS[reportLanguage].orderList : TRANSLATIONS[reportLanguage].damageReport}
                </h2>
              </div>
              <button 
                onClick={exportToPDF}
                disabled={(activeTab === 'order' ? orderList : damagedList).length === 0}
                className="bg-white text-black px-6 py-3 md:py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              >
                <Download size={16} /> {TRANSLATIONS[reportLanguage].exportPDF}
              </button>
            </div>

            <div className="space-y-4">
              {(activeTab === 'order' ? orderList : damagedList).length > 0 ? (
                (activeTab === 'order' ? orderList : damagedList).map(({ part, timestamp }) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={`${part.id}-${activeTab}`} 
                    className="group bg-[#141414]/80 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex items-center justify-between hover:border-white/20 transition-all"
                  >
                    <div className="flex gap-6 items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${activeTab === 'order' ? 'bg-landcros/10 text-landcros' : 'bg-red-500/10 text-red-500'}`}>
                        {activeTab === 'order' ? <ShoppingCart size={24} /> : <AlertTriangle size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white/5 text-zinc-400 rounded uppercase tracking-wider">
                            Sheet {part.sheet}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white/5 text-zinc-400 rounded uppercase tracking-wider">
                            Item {part.itemNumber}
                          </span>
                          {part.id.includes('-clone-') && (
                            <span className="text-[8px] font-black bg-landcros/20 text-landcros px-2 py-0.5 rounded uppercase tracking-tighter">
                              Cópia
                            </span>
                          )}
                        </div>
                        <h4 className="text-xl font-bold text-white tracking-tight">{part.partNumber}</h4>
                        <p className="text-sm text-zinc-500 font-mono italic">{part.description}</p>
                        {part.photo && (
                          <div className="mt-3 w-32 aspect-video rounded-lg overflow-hidden border border-white/10">
                            <img src={part.photo} className="w-full h-full object-cover" alt="Inspeção" />
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleItem(part, activeTab)}
                      className="p-3 text-zinc-700 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={24} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="py-32 text-center space-y-6 opacity-20">
                  <ClipboardList size={64} className="mx-auto" />
                  <p className="text-xl font-bold tracking-tight">{TRANSLATIONS[reportLanguage].noItems}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Câmera ao Vivo</span>
              </div>
              <button 
                onClick={stopCamera}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-950">
              {!cameraStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
                  <div className="w-12 h-12 border-4 border-landcros/20 border-t-landcros rounded-full animate-spin" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Iniciando Câmera...</span>
                </div>
              )}
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              
              {/* Camera Overlay UI */}
              <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/20 rounded-3xl" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-landcros m-4" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-landcros m-4" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-landcros m-4" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-landcros m-4" />
              </div>
            </div>

            <div className="p-12 bg-black flex items-center justify-center gap-12">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-40">
                <ImageIcon size={20} className="text-white" />
              </div>
              
              <button 
                onClick={capturePhoto}
                className="w-24 h-24 rounded-full border-4 border-white/20 p-1 hover:scale-105 transition-transform active:scale-95"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-black/5" />
                </div>
              </button>

              <button 
                onClick={toggleCamera}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
