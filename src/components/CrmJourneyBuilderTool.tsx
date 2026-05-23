import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Mail, 
  GitFork, 
  Clock, 
  Trash2, 
  GripHorizontal, 
  MousePointer, 
  RotateCcw, 
  Target, 
  Plus, 
  HelpCircle,
  Sparkles,
  Award,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface CRMNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  label: string;
  x: number;
  y: number;
}

interface CRMEdge {
  id: string;
  source: string;
  target: string;
}

interface CrmJourneyBuilderToolProps {
  onCalculateRun: () => void;
}

const NODE_WIDTH = 220;
const NODE_HEIGHT = 72;

const NODE_TYPES = {
  trigger: {
    icon: Play,
    color: 'bg-indigo-500',
    borderColor: 'border-indigo-600',
    lightColor: 'bg-indigo-50/80 text-indigo-900 border-indigo-150',
    label: 'Trigger Event',
    desc: 'Metode pemicu awal yang memulai suatu alur otomatisasi CRM berdasarkan interaksi masuk.'
  },
  action: {
    icon: Mail,
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-600',
    lightColor: 'bg-emerald-50/80 text-emerald-900 border-emerald-150',
    label: 'Action',
    desc: 'Tindakan aktif sistem seperti mengirim push notification, update status label database, dll.'
  },
  condition: {
    icon: GitFork,
    color: 'bg-amber-500',
    borderColor: 'border-amber-600',
    lightColor: 'bg-amber-50/80 text-amber-900 border-amber-150',
    label: 'Condition / Split',
    desc: 'Percabangan logika multi-arah memeriksa respon pembaca atau klasifikasi kategori pelanggan.'
  },
  delay: {
    icon: Clock,
    color: 'bg-sky-500',
    borderColor: 'border-sky-600',
    lightColor: 'bg-sky-50/80 text-sky-900 border-sky-150',
    label: 'Wait / Delay',
    desc: 'Waktu tunggu terjadwal atau durasi penundaan sebelum melangkah ke eksekusi tindakan berikut.'
  }
};

export default function CrmJourneyBuilderTool({ onCalculateRun }: CrmJourneyBuilderToolProps) {
  const [nodes, setNodes] = useState<CRMNode[]>([
    { id: 'node-1', type: 'trigger', label: 'Pelanggan Churn Terdeteksi', x: 50, y: 155 },
    { id: 'node-2', type: 'action', label: 'Kirim Email Interaksi Personal', x: 330, y: 155 },
    { id: 'node-3', type: 'condition', label: 'Apakah Pelanggan Membalas?', x: 610, y: 155 },
    { id: 'node-4', type: 'action', label: 'Kirim Kode Voucher Comeback 15%', x: 890, y: 55 },
    { id: 'node-5', type: 'delay', label: 'Tunggu Selama 3 Hari', x: 890, y: 255 },
    { id: 'node-6', type: 'action', label: 'Kirim Survey Kepuasan Khusus', x: 1170, y: 255 },
  ]);

  const [edges, setEdges] = useState<CRMEdge[]>([
    { id: 'edge-1-2', source: 'node-1', target: 'node-2' },
    { id: 'edge-2-3', source: 'node-2', target: 'node-3' },
    { id: 'edge-3-4', source: 'node-3', target: 'node-4' },
    { id: 'edge-3-5', source: 'node-3', target: 'node-5' },
    { id: 'edge-5-6', source: 'node-5', target: 'node-6' }
  ]);

  // History State for Undoing
  const [pastStates, setPastStates] = useState<{ nodes: CRMNode[]; edges: CRMEdge[] }[]>([]);
  const [interactionInitialState, setInteractionInitialState] = useState<{ nodes: CRMNode[]; edges: CRMEdge[] } | null>(null);

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

  const saveHistory = useCallback(() => {
    setPastStates((prev) => [...prev, { nodes: [...nodesRef.current], edges: [...edgesRef.current] }]);
  }, []);

  const handleUndo = useCallback(() => {
    if (pastStates.length === 0) return;
    const previousState = pastStates[pastStates.length - 1];
    setPastStates((prev) => prev.slice(0, -1));
    setNodes(previousState.nodes);
    setEdges(previousState.edges);
    onCalculateRun();
  }, [pastStates, onCalculateRun]);

  // Canvas Panning State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.0);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });

  // Dragging state for existing nodes
  const [draggingNode, setDraggingNode] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);

  // Connecting state for drawing lines
  const [connecting, setConnecting] = useState<{ sourceId: string; x: number; y: number } | null>(null);

  // Canvas offset tracking
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  // Node heights tracking for dynamic vertical centering of connections
  const [nodeHeights, setNodeHeights] = useState<Record<string, number>>({});
  const resizeObserver = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      setNodeHeights((prev) => {
        const newHeights = { ...prev };
        let changed = false;
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-node-id');
          const height = entry.target.getBoundingClientRect().height;
          if (id && newHeights[id] !== height) {
            newHeights[id] = height;
            changed = true;
          }
        });
        return changed ? newHeights : prev;
      });
    });

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  const setNodeRef = useCallback((el: HTMLDivElement | null) => {
    if (el && resizeObserver.current) {
      resizeObserver.current.observe(el);
    }
  }, []);

  useEffect(() => {
    const updateOffset = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasOffset({ x: rect.left, y: rect.top });
      }
    };
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  // --- Canvas Panning & Scrolling Handlers ---
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === 'canvas-background-area') {
      setIsPanning(true);
      setLastPanPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    setPan((prev) => ({
      x: prev.x - e.deltaX,
      y: prev.y - e.deltaY
    }));
  };

  // --- Drag and Drop from Sidebar Handlers ---
  const handleDragStartSidebar = (e: React.DragEvent, type: 'trigger' | 'action' | 'condition' | 'delay') => {
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType') as 'trigger' | 'action' | 'condition' | 'delay' | '';
    if (!type) return;

    saveHistory();

    const x = (e.clientX - canvasOffset.x - pan.x) / zoom - NODE_WIDTH / 2;
    const y = (e.clientY - canvasOffset.y - pan.y) / zoom - NODE_HEIGHT / 2;

    const config = NODE_TYPES[type];
    const newNode: CRMNode = {
      id: `node-${Date.now()}`,
      type,
      label: config.label,
      x,
      y
    };

    setNodes((prev) => [...prev, newNode]);
    onCalculateRun();
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Click-to-add fallback (helpful inside IFrames)
  const handleQuickAddNode = (type: 'trigger' | 'action' | 'condition' | 'delay') => {
    saveHistory();

    // Place it roughly at center or in view
    const x = (150 + Math.random() * 200 - pan.x) / zoom;
    const y = (150 + Math.random() * 200 - pan.y) / zoom;

    const config = NODE_TYPES[type];
    const newNode: CRMNode = {
      id: `node-${Date.now()}`,
      type,
      label: `Inisiatif Baru: ${config.label}`,
      x,
      y
    };

    setNodes((prev) => [...prev, newNode]);
    onCalculateRun();
  };

  // --- Handlers for Moving Existing Nodes ---
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    const tagName = (e.target as HTMLElement).tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || (e.target as HTMLElement).classList.contains('port')) return;

    setInteractionInitialState({ nodes: [...nodesRef.current], edges: [...edgesRef.current] });

    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    const logicalMouseX = (e.clientX - canvasOffset.x - pan.x) / zoom;
    const logicalMouseY = (e.clientY - canvasOffset.y - pan.y) / zoom;

    setDraggingNode({
      id,
      offsetX: logicalMouseX - node.x,
      offsetY: logicalMouseY - node.y
    });
  };

  // --- Creating Connections ---
  const handlePortMouseDown = (e: React.MouseEvent, sourceId: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === sourceId);
    if (!node) return;
    setConnecting({
      sourceId,
      x: node.x + NODE_WIDTH,
      y: node.y + (nodeHeights[sourceId] || NODE_HEIGHT) / 2
    });
  };

  const handlePortMouseUp = (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    if (connecting && connecting.sourceId !== targetId) {
      const edgeExists = edges.some(
        (edge) => edge.source === connecting.sourceId && edge.target === targetId
      );

      if (!edgeExists) {
        saveHistory();
        setEdges((prev) => [
          ...prev,
          {
            id: `edge-${connecting.sourceId}-${targetId}`,
            source: connecting.sourceId,
            target: targetId
          }
        ]);
        onCalculateRun();
      }
    }
    setConnecting(null);
  };

  // --- Global Mouse Movement & Lift Canvas Level ---
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isPanning) {
        setLastPanPosition((prev) => {
          const dx = e.clientX - prev.x;
          const dy = e.clientY - prev.y;
          setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
          return { x: e.clientX, y: e.clientY };
        });
      } else if (draggingNode) {
        const logicalMouseX = (e.clientX - canvasOffset.x - pan.x) / zoom;
        const logicalMouseY = (e.clientY - canvasOffset.y - pan.y) / zoom;

        setNodes((prev) =>
          prev.map((n) =>
            n.id === draggingNode.id
              ? {
                  ...n,
                  x: logicalMouseX - draggingNode.offsetX,
                  y: logicalMouseY - draggingNode.offsetY
                }
              : n
          )
        );
      } else if (connecting) {
        setConnecting((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            x: (e.clientX - canvasOffset.x - pan.x) / zoom,
            y: (e.clientY - canvasOffset.y - pan.y) / zoom
          };
        });
      }
    },
    [draggingNode, connecting, isPanning, canvasOffset, pan, zoom]
  );

  const handleGlobalMouseUp = useCallback(() => {
    if (draggingNode && interactionInitialState) {
      const initialNode = interactionInitialState.nodes.find((n) => n.id === draggingNode.id);
      const currentNode = nodesRef.current.find((n) => n.id === draggingNode.id);
      if (
        initialNode &&
        currentNode &&
        (initialNode.x !== currentNode.x || initialNode.y !== currentNode.y)
      ) {
        setPastStates((prev) => [...prev, interactionInitialState]);
      }
    }

    setDraggingNode(null);
    setConnecting(null);
    setIsPanning(false);
    setInteractionInitialState(null);
  }, [draggingNode, interactionInitialState]);

  useEffect(() => {
    if (draggingNode || connecting || isPanning) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    } else {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggingNode, connecting, isPanning, handleGlobalMouseMove, handleGlobalMouseUp]);

  // --- Node & Edge Modification ---
  const updateNodeLabel = (id: string, newLabel: string) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, label: newLabel } : n)));
  };

  const deleteNode = (id: string) => {
    saveHistory();
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
    onCalculateRun();
  };

  const deleteEdge = (id: string) => {
    saveHistory();
    setEdges((prev) => prev.filter((e) => e.id !== id));
    onCalculateRun();
  };

  const createBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
    const controlPointOffset = Math.max(Math.abs(x2 - x1) / 2, 50);
    return `M ${x1} ${y1} C ${x1 + controlPointOffset} ${y1}, ${x2 - controlPointOffset} ${y2}, ${x2} ${y2}`;
  };

  const clearCanvas = () => {
    saveHistory();
    setNodes([]);
    setEdges([]);
    setPan({ x: 0, y: 0 });
    onCalculateRun();
  };

  return (
    <div className="space-y-6 text-left selection:bg-indigo-150 relative font-sans w-full select-none">
      
      {/* Alert Header Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-400">
            Interactive Journey Builder
          </span>
          <h3 className="font-display font-black text-lg lg:text-xl text-white mt-1">
            CRM Customer Flow & Automated Journey Builder
          </h3>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Visualisasikan dan simulasikan alur otomatisasi CRM (Customer Retention Journey). Tarik blok pembangun nilai di panel kiri dan letakkan ke bidan kanvas, lalu hubungkan titik-titik port untuk mendesain respon alur otomatisasi yang dinamis.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-300">Workspace Terbuka</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Element Palette / Selector */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-6 self-stretch">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Palet Blok CRM
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Tarik elemen ke dalam kanas, atau klik tombol <strong className="text-slate-800">(+)</strong> untuk menambahkan langsung di atas rentang layar.
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(NODE_TYPES).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <div
                    key={type}
                    draggable
                    onDragStart={(e) => handleDragStartSidebar(e, type as any)}
                    className={`group p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 shadow-xs cursor-grab active:cursor-grabbing transition-all hover:shadow-xs flex items-center justify-between gap-3`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg text-white font-bold shrink-0 ${config.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-800 block truncate leading-tight">
                          {config.label}
                        </span>
                        <span className="text-[9px] text-slate-400 block truncate mt-0.5">
                          {config.desc}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickAddNode(type as any)}
                      className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors shrink-0 cursor-pointer"
                      title="Klik untuk menambahkan langsung ke kanvas"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 shrink-0">
            <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">
              Instruksi Pintasan Kanvas
            </h5>
            <ul className="text-[10.5px] text-slate-500 space-y-1.5 list-disc list-inside">
              <li>Pindahkan kanvas dengan mendrag background kosong.</li>
              <li>Tarik lingkaran port kanan ke port kiri node lain untuk menghubungkan arah alur.</li>
              <li>Klik icon silang (<Trash2 className="inline h-3 w-3 align-text-bottom" />) merah untuk menghapus koneksi alur.</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Flow Interactive Canvas Area */}
        <div className="lg:col-span-9 flex flex-col self-stretch bg-white border border-slate-250/70 rounded-2xl overflow-hidden min-h-[500px] lg:min-h-[580px] transition-all relative">
          
          {/* Workdesk Control Bar */}
          <div className="bg-slate-50/80 border-b border-slate-200/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                Interactive Design Sandbox
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-0.5 shadow-xs mr-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setZoom(prev => Math.max(0.4, prev - 0.1))}
                  disabled={zoom <= 0.4}
                  className="p-1 px-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 disabled:opacity-40 select-none cursor-pointer transition-colors"
                  title="Zoom Out (Perkecil)"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1.0)}
                  className="text-[11px] font-mono font-bold text-slate-700 w-12 hover:text-indigo-650 hover:bg-indigo-50/50 rounded-md select-none cursor-pointer transition-all py-0.5 text-center"
                  title="Kembalikan ke Ukuran Normal (100%)"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(prev => Math.min(2.0, prev + 0.1))}
                  disabled={zoom >= 2.0}
                  className="p-1 px-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 disabled:opacity-40 select-none cursor-pointer transition-colors"
                  title="Zoom In (Perbesar)"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleUndo}
                disabled={pastStates.length === 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  pastStates.length === 0
                    ? 'bg-slate-150 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-600 hover:text-slate-800 border-slate-200 hover:bg-slate-50 cursor-pointer'
                }`}
                title="Undo langkah desain sebelumnya"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Undo Action</span>
              </button>

              <button
                type="button"
                onClick={() => setPan({ x: 0, y: 0 })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-600 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                title="Kembalikan koordinat layar ke awal"
              >
                <Target className="h-3.5 w-3.5 text-slate-500" />
                <span>Reset View</span>
              </button>

              <button
                type="button"
                onClick={clearCanvas}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-red-650 text-red-600 hover:text-red-700 border border-slate-200 hover:bg-red-50/40 hover:border-red-200 cursor-pointer transition-colors"
                title="Wipe kanvas alur"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Canvas</span>
              </button>
            </div>
          </div>

          {/* Core SVG & HTML Drag-Drop Canvas */}
          <div
            id="canvas-background-area"
            ref={canvasRef}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            onMouseDown={handleCanvasMouseDown}
            onWheel={handleWheel}
            className={`flex-1 relative overflow-hidden bg-slate-50/60 leading-none select-none ${
              isPanning ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 0)',
              backgroundSize: '24px 24px',
              backgroundPosition: `${pan.x}px ${pan.y}px`
            }}
          >
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400/80 pointer-events-none z-0 p-6 text-center max-w-sm mx-auto">
                <MousePointer className="w-10 h-10 mb-3 opacity-40 text-indigo-505 text-indigo-500" />
                <h4 className="font-display font-extrabold text-sm text-slate-700">Kanvas Alur Masih Kosong</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Tarik komponen dari palet di sebelah kiri atau klik tombol (+) untuk meluncurkan blok otomatisasi journey Anda.
                </p>
              </div>
            )}

            {/* Canvas Transformation Node Matrix Wrapper */}
            <div
              className="absolute top-0 left-0 w-full h-full pointer-events-none origin-top-left"
              style={{ 
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'top left'
              }}
            >
              
              {/* Connection Paths SVG Overlay */}
              <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-0">
                {edges.map((edge) => {
                  const sourceNode = nodes.find((n) => n.id === edge.source);
                  const targetNode = nodes.find((n) => n.id === edge.target);

                  if (!sourceNode || !targetNode) return null;

                  const startX = sourceNode.x + NODE_WIDTH;
                  const startY = sourceNode.y + (nodeHeights[sourceNode.id] || NODE_HEIGHT) / 2;
                  const endX = targetNode.x;
                  const endY = targetNode.y + (nodeHeights[targetNode.id] || NODE_HEIGHT) / 2;

                  return (
                    <g key={edge.id} className="pointer-events-auto group">
                      {/* Generous hover zone */}
                      <path
                        d={createBezierPath(startX, startY, endX, endY)}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="16"
                        className="cursor-pointer"
                        onClick={() => deleteEdge(edge.id)}
                      />
                      {/* Beautiful glowing path */}
                      <path
                        d={createBezierPath(startX, startY, endX, endY)}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="text-slate-350 dark:text-slate-600 text-slate-400 group-hover:text-red-500 transition-colors duration-200"
                      />
                      {/* Center Point delete trigger */}
                      <circle
                        cx={(startX + endX) / 2}
                        cy={(startY + endY) / 2}
                        r="11"
                        className="fill-red-550 fill-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm duration-200"
                        onClick={() => deleteEdge(edge.id)}
                      />
                      <path
                        d={`M ${(startX + endX) / 2 - 3.5} ${(startY + endY) / 2 - 3.5} L ${(startX + endX) / 2 + 3.5} ${(startY + endY) / 2 + 3.5} M ${(startX + endX) / 2 + 3.5} ${(startY + endY) / 2 - 3.5} L ${(startX + endX) / 2 - 3.5} ${(startY + endY) / 2 + 3.5}`}
                        stroke="white"
                        strokeWidth="2.5"
                        className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-250"
                      />
                    </g>
                  );
                })}

                {/* Active connecting rubber band path */}
                {connecting && (
                  <path
                    d={createBezierPath(
                      (nodes.find((n) => n.id === connecting.sourceId)?.x || 0) + NODE_WIDTH,
                      (nodes.find((n) => n.id === connecting.sourceId)?.y || 0) +
                        (nodeHeights[connecting.sourceId] || NODE_HEIGHT) / 2,
                      connecting.x,
                      connecting.y
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="4,4"
                    className="text-indigo-500 animate-pulse"
                  />
                )}
              </svg>

              {/* CRM Flow Nodes Container */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                {nodes.map((node) => {
                  const config = NODE_TYPES[node.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={node.id}
                      data-node-id={node.id}
                      ref={setNodeRef}
                      className={`absolute pointer-events-auto rounded-xl shadow-xs border-2 bg-white ${
                        config.borderColor
                      } group flex flex-col transition-shadow hover:shadow-md duration-200`}
                      style={{
                        left: node.x,
                        top: node.y,
                        width: NODE_WIDTH,
                        cursor: draggingNode?.id === node.id ? 'grabbing' : 'grab'
                      }}
                      onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    >
                      {/* Node Delete Pin button */}
                      <button
                        type="button"
                        onClick={() => deleteNode(node.id)}
                        className="absolute -top-2.5 -right-2.5 p-1 bg-white border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-500 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity z-25 cursor-pointer"
                        title="Hapus node"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      {/* Header block representing node classification */}
                      <div
                        className={`px-3 py-1.5 flex items-center gap-1.5 rounded-t-lg border-b border-slate-100 ${config.lightColor}`}
                      >
                        <div className={`p-1 rounded text-white font-bold shrink-0 ${config.color}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-extrabold opacity-80 truncate">
                          {config.label}
                        </span>
                      </div>

                      {/* Configurable inner parameter text */}
                      <div className="p-3">
                        <textarea
                          value={node.label}
                          onChange={(e) => updateNodeLabel(node.id, e.target.value)}
                          onFocus={() => {
                            setInteractionInitialState({
                              nodes: [...nodesRef.current],
                              edges: [...edgesRef.current]
                            });
                          }}
                          onBlur={() => {
                            if (interactionInitialState) {
                              const initialNode = interactionInitialState.nodes.find(
                                (n) => n.id === node.id
                              );
                              if (initialNode && initialNode.label !== node.label) {
                                setPastStates((prev) => [...prev, interactionInitialState]);
                              }
                              setInteractionInitialState(null);
                            }
                          }}
                          rows={1}
                          style={{ resize: 'none', overflow: 'hidden' }}
                          className="w-full text-xs font-semibold bg-transparent border-none outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1 -ml-1 text-slate-800 tracking-tight leading-relaxed select-text"
                          placeholder="Deklarasikan isi alur..."
                        />
                      </div>

                      {/* INPUT PORT (Target node connections dot) */}
                      {node.type !== 'trigger' && (
                        <div
                          className="port absolute -left-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-slate-350 hover:border-indigo-500 rounded-full cursor-crosshair hover:scale-110 transition-all z-20 shadow-xs"
                          onMouseUp={(e) => handlePortMouseUp(e, node.id)}
                          title="Hubungkan asupan alur"
                        />
                      )}

                      {/* OUTPUT PORT (Source node connection dot) */}
                      <div
                        className="port absolute -right-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-slate-350 hover:border-indigo-500 rounded-full cursor-crosshair hover:scale-110 transition-all z-20 shadow-xs"
                        onMouseDown={(e) => handlePortMouseDown(e, node.id)}
                        title="Tarik untuk menghubungkan tindakan keluaran"
                      />
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
