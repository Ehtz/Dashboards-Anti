'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, X, Check, Search, Info, TrendingUp, Shield, Cpu, Users, DollarSign, Brain, Globe, Activity, Layers, Target, Zap, Lock, BarChart3, RotateCcw } from 'lucide-react';

// --- Types & Constants ---

// Grouping matrices for better UI organization
const MATRIX_GROUPS = {
    FINANCIALS: 'Financial Health & Economics',
    MARKET: 'Market & Growth',
    PRODUCT: 'Product & UX',
    OPERATIONS: 'Operations & Risk'
};

const MATRICES = [
    // --- Row 1: Frequency & Financials ---
    {
        id: 'net-margin',
        group: MATRIX_GROUPS.FINANCIALS,
        title: 'Net Margin Profile',
        xAxis: 'Avg Use Frequency',
        yAxis: 'Net Margin %',
        xKey: 'frequency',
        yKey: 'netMargin',
        icon: DollarSign,
        lowLow: 'Cash Burner',
        lowHigh: 'Niche Profitable',
        highLow: 'High Churn Risk',
        highHigh: 'Cash Cow'
    },
    {
        id: 'gross-margin',
        group: MATRIX_GROUPS.FINANCIALS,
        title: 'Gross Margin Profile',
        xAxis: 'Avg Use Frequency',
        yAxis: 'Gross Margin %',
        xKey: 'frequency',
        yKey: 'grossMargin',
        icon: DollarSign,
        lowLow: 'Commodity',
        lowHigh: 'Premium Service',
        highLow: 'Volume Play',
        highHigh: 'SaaS Unicorn'
    },
    {
        id: 'freq-arpu',
        group: MATRIX_GROUPS.FINANCIALS,
        title: 'Revenue Habit',
        xAxis: 'Avg Use Frequency',
        yAxis: 'ARPU',
        xKey: 'frequency',
        yKey: 'arpu',
        icon: Activity,
        lowLow: 'Low Value',
        lowHigh: 'Enterprise (One-off)',
        highLow: 'Ad/Micro-trans',
        highHigh: 'Recurring Enterprise'
    },
    {
        id: 'freq-ltv',
        group: MATRIX_GROUPS.FINANCIALS,
        title: 'Long Term Value',
        xAxis: 'Avg Use Frequency',
        yAxis: 'LTV (5yr)',
        xKey: 'frequency',
        yKey: 'ltv',
        icon: TrendingUp,
        lowLow: 'Churn Factory',
        lowHigh: 'Consulting Model',
        highLow: 'Utility Subscription',
        highHigh: 'Compounder'
    },

    // --- Row 2: Market Segments ---
    {
        id: 'tam-arpu',
        group: MATRIX_GROUPS.MARKET,
        title: 'TAM Economics',
        xAxis: 'TAM (Total Addressable)',
        yAxis: 'ARPU',
        xKey: 'tam',
        yKey: 'arpu',
        icon: Globe,
        lowLow: 'Niche Hobby',
        lowHigh: 'Boutique Luxury',
        highLow: 'Mass Market',
        highHigh: 'Platform Giant'
    },
    {
        id: 'sam-arpu',
        group: MATRIX_GROUPS.MARKET,
        title: 'SAM Economics',
        xAxis: 'SAM (Serviceable Avail)',
        yAxis: 'ARPU',
        xKey: 'sam',
        yKey: 'arpu',
        icon: Target,
        lowLow: 'Local Player',
        lowHigh: 'Specialized High-End',
        highLow: 'Regional Vol',
        highHigh: 'Market Leader'
    },
    {
        id: 'som-arpu',
        group: MATRIX_GROUPS.MARKET,
        title: 'SOM Economics',
        xAxis: 'SOM (Serviceable Obtain)',
        yAxis: 'ARPU',
        xKey: 'som',
        yKey: 'arpu',
        icon: Target,
        lowLow: 'Struggling',
        lowHigh: 'Profitable Niche',
        highLow: 'Commodity Winner',
        highHigh: 'Monopoly'
    },
    {
        id: 'ltv-cac',
        group: MATRIX_GROUPS.MARKET,
        title: 'Unit Economics (LTV:CAC)',
        xAxis: 'CAC (Cost to Acquire)',
        yAxis: 'LTV',
        xKey: 'cac',
        yKey: 'ltv',
        icon: BarChart3,
        lowLow: 'The Graveyard',
        lowHigh: 'Organic/Viral',
        highLow: 'Venture Burn',
        highHigh: 'Enterprise Scale'
    },

    // --- Row 3: Product & UX ---
    {
        id: 'shipping',
        group: MATRIX_GROUPS.PRODUCT,
        title: 'Engineering Culture',
        xAxis: 'Speed of Shipping',
        yAxis: 'Quality/Stability',
        xKey: 'shippingSpeed',
        yKey: 'quality',
        icon: Zap,
        lowLow: 'Doomed',
        lowHigh: 'Legacy Bank',
        highLow: 'Move Fast Break Things',
        highHigh: 'High Performer'
    },
    {
        id: 'virality',
        group: MATRIX_GROUPS.PRODUCT,
        title: 'Advocacy Potential',
        xAxis: 'Avg Use Frequency',
        yAxis: 'Share Opportunities',
        xKey: 'frequency',
        yKey: 'shareOpp',
        icon: Users,
        lowLow: 'Secret Tool',
        lowHigh: 'Referral Driven',
        highLow: 'Habitual',
        highHigh: 'Social/Viral'
    },
    {
        id: 'cognitive',
        group: MATRIX_GROUPS.PRODUCT,
        title: 'Cognitive Economics',
        xAxis: 'Cognitive Load',
        yAxis: 'ARPU',
        xKey: 'cognitiveLoad',
        yKey: 'arpu',
        icon: Brain,
        lowLow: 'Cheap & Simple',
        lowHigh: 'Enterprise Complex',
        highLow: 'Consumer App',
        highHigh: 'Invisible Tech'
    },
    {
        id: 'pmf',
        group: MATRIX_GROUPS.PRODUCT,
        title: 'Product Market Fit',
        xAxis: 'Market Size Potential',
        yAxis: 'CSAT / Retention',
        xKey: 'marketSize',
        yKey: 'csat',
        icon: Check,
        lowLow: 'Pivot Needed',
        lowHigh: 'Cult Product',
        highLow: 'Leaky Bucket',
        highHigh: 'Scale Ready'
    },
    {
        id: 'sales-friction',
        group: MATRIX_GROUPS.PRODUCT,
        title: 'Sales Friction',
        xAxis: 'Value Prop Clarity',
        yAxis: 'No Brainer Score',
        xKey: 'clarity',
        yKey: 'buyability',
        icon: Layers,
        lowLow: 'Consultative Sale',
        lowHigh: 'Commodity',
        highLow: 'Visionary Sell',
        highHigh: 'PLG / Self-Serve'
    },

    // --- Row 4: Operations & Risk ---
    {
        id: 'risk-control',
        group: MATRIX_GROUPS.OPERATIONS,
        title: 'Operational Reliance',
        xAxis: 'Dependency Control',
        yAxis: 'Operational Risk',
        xKey: 'control',
        yKey: 'risk',
        icon: Shield,
        lowLow: 'Platform Dependent',
        lowHigh: 'Gambling',
        highLow: 'Walled Garden',
        highHigh: 'Sovereign'
    },
    {
        id: 'tech-value',
        group: MATRIX_GROUPS.OPERATIONS,
        title: 'Tech Valuation',
        xAxis: 'Infra Complexity',
        yAxis: 'ARPU',
        xKey: 'complexity',
        yKey: 'arpu',
        icon: Lock,
        lowLow: 'Wrapper',
        lowHigh: 'Deep Tech',
        highLow: 'Over-engineered',
        highHigh: 'Moat'
    },
    {
        id: 'mindshare',
        group: MATRIX_GROUPS.OPERATIONS,
        title: 'Mind Share',
        xAxis: 'Avg Use Frequency',
        yAxis: 'Daily Mind Share',
        xKey: 'frequency',
        yKey: 'mindShare',
        icon: Brain,
        lowLow: 'Forgotten',
        lowHigh: 'Utility (Plumbing)',
        highLow: 'Addiction',
        highHigh: 'Top of Mind'
    },
    {
        id: 'cyborg',
        group: MATRIX_GROUPS.OPERATIONS,
        title: 'Cyborg Matrix (AI)',
        xAxis: 'Human Input Freq',
        yAxis: 'AI Autonomy',
        xKey: 'humanInput',
        yKey: 'aiAutonomy',
        icon: Cpu,
        lowLow: 'Legacy Tool',
        lowHigh: 'Black Box',
        highLow: 'Consultancy',
        highHigh: 'Co-Pilot'
    },
    {
        id: 'leverage',
        group: MATRIX_GROUPS.OPERATIONS,
        title: 'Output Leverage',
        xAxis: 'Time Input (1yr)',
        yAxis: 'Output ($)',
        xKey: 'timeInput',
        yKey: 'output',
        icon: TrendingUp,
        lowLow: 'Slog',
        lowHigh: 'High Leverage',
        highLow: 'Service Biz',
        highHigh: 'Software Scale'
    }
];

// Initial Mock Data
const INITIAL_BUSINESSES = [
    {
        id: 1,
        name: 'FedEx',
        color: '#4f46e5', // Indigo
        desc: 'Global logistics giant with massive physical infrastructure.',
        scores: {
            frequency: 60, netMargin: 15, grossMargin: 40, arpu: 70, ltv: 85,
            tam: 95, sam: 90, som: 80, cac: 60,
            shippingSpeed: 95, quality: 90, shareOpp: 20, cognitiveLoad: 20,
            marketSize: 95, csat: 80, clarity: 90, buyability: 85,
            control: 90, risk: 40, complexity: 95, mindShare: 85,
            humanInput: 80, aiAutonomy: 40, timeInput: 50, output: 85
        },
        // We duplicate scores to initialScores to allow "Reset to Default"
        initialScores: {
            frequency: 60, netMargin: 15, grossMargin: 40, arpu: 70, ltv: 85,
            tam: 95, sam: 90, som: 80, cac: 60,
            shippingSpeed: 95, quality: 90, shareOpp: 20, cognitiveLoad: 20,
            marketSize: 95, csat: 80, clarity: 90, buyability: 85,
            control: 90, risk: 40, complexity: 95, mindShare: 85,
            humanInput: 80, aiAutonomy: 40, timeInput: 50, output: 85
        },
        reasoning: "FedEx combines extreme efficiency (hub-and-spoke) with robust resilience. High trust, high utility, massive infrastructure moat."
    },
    {
        id: 2,
        name: 'Notion',
        color: '#000000',
        desc: 'All-in-one workspace for notes and docs.',
        scores: {
            frequency: 90, netMargin: 30, grossMargin: 85, arpu: 40, ltv: 75,
            tam: 80, sam: 70, som: 60, cac: 30,
            shippingSpeed: 80, quality: 75, shareOpp: 85, cognitiveLoad: 70,
            marketSize: 85, csat: 85, clarity: 60, buyability: 80,
            control: 95, risk: 20, complexity: 60, mindShare: 80,
            humanInput: 60, aiAutonomy: 85, timeInput: 20, output: 90
        },
        initialScores: {
            frequency: 90, netMargin: 30, grossMargin: 85, arpu: 40, ltv: 75,
            tam: 80, sam: 70, som: 60, cac: 30,
            shippingSpeed: 80, quality: 75, shareOpp: 85, cognitiveLoad: 70,
            marketSize: 85, csat: 85, clarity: 60, buyability: 80,
            control: 95, risk: 20, complexity: 60, mindShare: 80,
            humanInput: 60, aiAutonomy: 85, timeInput: 20, output: 90
        },
        reasoning: "High virality PLG motion. High AI integration. Slightly higher cognitive load due to flexibility."
    }
];

// --- Helper Components ---

const MatrixChart = ({ matrix, businesses, onUpdateScore }: any) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [draggingId, setDraggingId] = useState<number | null>(null);

    // Handle global mouse move/up to allow dragging outside the box
    useEffect(() => {
        const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
            if (!draggingId || !containerRef.current) return;
            // e.preventDefault(); // Commented out to prevent passive event listener issues

            const rect = containerRef.current.getBoundingClientRect();

            // Calculate X and Y as percentages (0-100)
            // We clamp between 0 and 100
            let clientX, clientY;
            if ('touches' in e) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = (e as MouseEvent).clientX;
                clientY = (e as MouseEvent).clientY;
            }

            let x = ((clientX - rect.left) / rect.width) * 100;
            let y = ((clientY - rect.top) / rect.height) * 100;

            x = Math.max(0, Math.min(100, x));
            y = Math.max(0, Math.min(100, y));

            // Y is typically inverted in CSS (bottom=0 is visual bottom), 
            // but clientY increases downwards. 
            // If we want visual drag: 
            // Mouse Top (0) -> CSS Bottom (100)
            // Mouse Bottom (100) -> CSS Bottom (0)
            const invertedY = 100 - y;

            onUpdateScore(draggingId, matrix.xKey, Math.round(x), matrix.yKey, Math.round(invertedY));
        };

        const handleGlobalUp = () => {
            setDraggingId(null);
        };

        if (draggingId) {
            window.addEventListener('mousemove', handleGlobalMove);
            window.addEventListener('mouseup', handleGlobalUp);
            // Support Touch
            window.addEventListener('touchmove', handleGlobalMove);
            window.addEventListener('touchend', handleGlobalUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('touchmove', handleGlobalMove);
            window.removeEventListener('touchend', handleGlobalUp);
        };
    }, [draggingId, matrix, onUpdateScore]);


    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col h-full hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <matrix.icon className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-800 text-sm">{matrix.title}</h3>
            </div>

            {/* Chart Area */}
            <div
                ref={containerRef}
                className="relative aspect-square w-full bg-slate-50 border border-slate-300 rounded-lg mb-4 cursor-crosshair overflow-hidden"
            >

                {/* Grid Lines */}
                <div className="absolute inset-0 flex pointer-events-none">
                    <div className="w-1/2 border-r border-slate-300 border-dashed h-full"></div>
                    <div className="w-1/2 h-full"></div>
                </div>
                <div className="absolute inset-0 flex flex-col pointer-events-none">
                    <div className="h-1/2 border-b border-slate-300 border-dashed w-full"></div>
                    <div className="h-1/2 w-full"></div>
                </div>

                {/* Quadrant Labels */}
                <span className="absolute top-2 left-2 text-[9px] text-slate-400 font-medium leading-tight max-w-[45%] pointer-events-none">{matrix.highLow}</span>
                <span className="absolute top-2 right-2 text-[9px] text-slate-400 font-medium text-right leading-tight max-w-[45%] pointer-events-none">{matrix.highHigh}</span>
                <span className="absolute bottom-2 left-2 text-[9px] text-slate-400 font-medium leading-tight max-w-[45%] pointer-events-none">{matrix.lowLow}</span>
                <span className="absolute bottom-2 right-2 text-[9px] text-slate-400 font-medium text-right leading-tight max-w-[45%] pointer-events-none">{matrix.lowHigh}</span>

                {/* Axis Labels */}
                <div className="absolute -left-6 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[9px] font-bold text-slate-500 -rotate-90 whitespace-nowrap tracking-wider">{matrix.yAxis}</span>
                </div>
                <div className="absolute -bottom-6 left-0 right-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[9px] font-bold text-slate-500 whitespace-nowrap tracking-wider">{matrix.xAxis}</span>
                </div>

                {/* Plot Points */}
                {businesses.map((biz: any) => {
                    const x = biz.scores[matrix.xKey] || 50;
                    const y = biz.scores[matrix.yKey] || 50;
                    const isDragging = draggingId === biz.id;

                    return (
                        <div
                            key={biz.id}
                            onMouseDown={(e) => { e.stopPropagation(); setDraggingId(biz.id); }}
                            onTouchStart={(e) => { e.stopPropagation(); setDraggingId(biz.id); }}
                            className={`absolute w-5 h-5 rounded-full border-2 shadow-md transform -translate-x-1/2 -translate-y-1/2 transition-shadow z-20 
                ${isDragging ? 'cursor-grabbing scale-110 ring-2 ring-offset-2 ring-slate-400' : 'cursor-grab hover:scale-125'}
              `}
                            style={{
                                left: `${x}%`,
                                bottom: `${y}%`,
                                backgroundColor: biz.color,
                                borderColor: isDragging ? '#fff' : 'white'
                            }}
                        >
                            {/* Tooltip only if not dragging */}
                            {!isDragging && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 bg-slate-800 text-white text-xs rounded p-2 z-50 pointer-events-none shadow-lg">
                                    <div className="font-bold">{biz.name}</div>
                                    <div className="text-[10px] opacity-80 mt-1">
                                        X: {x} | Y: {y}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function BusinessMatrixDashboard() {
    const [businesses, setBusinesses] = useState(INITIAL_BUSINESSES);
    const [showAddModal, setShowAddModal] = useState(false);

    // New Business Form State
    const [newBizName, setNewBizName] = useState('');
    const [newBizDesc, setNewBizDesc] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);

    // Initialize all possible score keys to 50
    const initialScores = useMemo(() => {
        const keys = new Set<string>();
        MATRICES.forEach(m => { keys.add(m.xKey); keys.add(m.yKey); });
        return Array.from(keys).reduce((acc, key) => ({ ...acc, [key]: 50 }), {} as Record<string, number>);
    }, []);

    const [newBizScores, setNewBizScores] = useState(initialScores);

    // Simulated AI Analyzer
    const analyzeBusiness = async () => {
        if (!newBizDesc) return;
        setIsAnalyzing(true);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: newBizDesc }),
            });

            if (!response.ok) throw new Error('Analysis failed');

            const data = await response.json();
            setNewBizScores(data.scores);
            setAnalysisComplete(true);
        } catch (error) {
            console.error(error);
            // Fallback to random if API fails (or show error)
            const scores = { ...newBizScores };
            Object.keys(scores).forEach(k => {
                if (scores[k] === 50) scores[k] = Math.floor(Math.random() * 40) + 30;
            });
            setNewBizScores(scores);
            setAnalysisComplete(true);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAddBusiness = () => {
        if (!newBizName) return;
    };

    const resetForm = () => {
        setNewBizName('');
        setNewBizDesc('');
        setAnalysisComplete(false);
        setNewBizScores(initialScores);
    };

    const deleteBusiness = (id: number) => {
        setBusinesses(businesses.filter(b => b.id !== id));
    };

    // Reset business scores to their initial analysis state
    const resetBusinessToDefault = (id: number) => {
        setBusinesses(businesses.map(b => {
            if (b.id === id) {
                return { ...b, scores: { ...b.initialScores } };
            }
            return b;
        }));
    };

    // Function passed down to charts to update specific coordinates
    const updateBusinessScore = (id: number, xKey: string, xVal: number, yKey: string, yVal: number) => {
        setBusinesses(prev => prev.map(b => {
            if (b.id === id) {
                return {
                    ...b,
                    scores: {
                        ...b.scores,
                        [xKey]: xVal,
                        [yKey]: yVal
                    }
                };
            }
            return b;
        }));
    };

    // Group Matrices for Display
    const groupedMatrices = useMemo(() => {
        const groups: Record<string, typeof MATRICES> = {};
        Object.values(MATRIX_GROUPS).forEach(g => groups[g] = []);
        MATRICES.forEach(m => {
            if (!groups[m.group]) groups[m.group] = [];
            groups[m.group].push(m);
        });
        return groups;
    }, []);

    // Pattern Analysis State
    const [showPatternModal, setShowPatternModal] = useState(false);
    const [patternQuery, setPatternQuery] = useState('');
    const [patternResult, setPatternResult] = useState('');
    const [isAnalyzingPattern, setIsAnalyzingPattern] = useState(false);

    const analyzePatterns = async () => {
        if (!patternQuery) return;
        setIsAnalyzingPattern(true);
        setPatternResult('');

        try {
            const response = await fetch('/api/patterns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businesses, query: patternQuery }),
            });

            if (!response.ok) throw new Error('Pattern analysis failed');

            const data = await response.json();
            setPatternResult(data.analysis);
        } catch (error) {
            console.error(error);
            setPatternResult('Failed to analyze patterns. Please try again.');
        } finally {
            setIsAnalyzingPattern(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden md:block">
                            PatternMaster <span className="text-slate-400 font-normal text-sm ml-2">Strategic Analysis Dashboard</span>
                        </h1>
                        <h1 className="text-xl font-bold md:hidden text-indigo-600">PatternMaster</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowPatternModal(true)}
                            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm md:text-base"
                        >
                            <Brain size={18} />
                            <span className="hidden md:inline">Ask AI</span>
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm md:text-base"
                        >
                            <Plus size={18} />
                            New Analysis
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-[1600px] mx-auto px-4 py-8">

                {/* Active Businesses Filters */}
                <div className="mb-8 flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Entities:</span>
                    {businesses.map(b => (
                        <div key={b.id} className="flex items-center gap-2 bg-slate-100 pl-3 pr-2 py-1.5 rounded-full border border-slate-200 shadow-sm group">
                            <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: b.color }}></span>
                            <span className="font-bold text-sm text-slate-700">{b.name}</span>

                            <div className="flex items-center gap-1 border-l border-slate-300 pl-2 ml-1">
                                <button
                                    onClick={() => resetBusinessToDefault(b.id)}
                                    title="Reset to default analysis position"
                                    className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-slate-200"
                                >
                                    <RotateCcw size={12} />
                                </button>
                                <button
                                    onClick={() => deleteBusiness(b.id)}
                                    title="Remove business"
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-slate-200"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {businesses.length === 0 && <span className="text-sm text-slate-400 italic">No businesses loaded. Add one to start.</span>}
                </div>

                {/* Matrix Grid Grouped by Category */}
                <div className="space-y-12">
                    {Object.entries(groupedMatrices).map(([groupName, matrices]) => (
                        <div key={groupName}>
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
                                <Layers className="text-indigo-500" size={20} />
                                <h2 className="text-xl font-bold text-slate-800">{groupName}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {matrices.map(matrix => (
                                    <MatrixChart
                                        key={matrix.id}
                                        matrix={matrix}
                                        businesses={businesses}
                                        onUpdateScore={updateBusinessScore}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Add Business Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <h2 className="text-xl font-bold text-slate-800">New Strategic Analysis</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Scrollable Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">

                            {/* Step 1: Input */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
                                        <input
                                            type="text"
                                            value={newBizName}
                                            onChange={(e) => setNewBizName(e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="e.g. Uber, Slack, MyStartup.ai"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Insider Info / Description / URL</label>
                                        <textarea
                                            value={newBizDesc}
                                            onChange={(e) => setNewBizDesc(e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none text-sm"
                                            placeholder="Paste your raw notes here. Our system will analyze text patterns to score against the 19 matrices..."
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col justify-end">
                                    {!analysisComplete ? (
                                        <button
                                            onClick={analyzeBusiness}
                                            disabled={!newBizName || !newBizDesc || isAnalyzing}
                                            className="w-full h-32 bg-indigo-600 disabled:bg-indigo-300 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-3 hover:bg-indigo-700 transition-colors shadow-lg"
                                        >
                                            {isAnalyzing ? <RefreshCw className="animate-spin" size={32} /> : <Brain size={32} />}
                                            <span>{isAnalyzing ? 'Extracting Patterns...' : 'Run Deep Analysis'}</span>
                                        </button>
                                    ) : (
                                        <div className="w-full h-32 flex flex-col items-center justify-center bg-green-50 text-green-700 rounded-xl border-2 border-green-200">
                                            <Check size={32} className="mb-2" />
                                            <span className="font-bold">Analysis Complete</span>
                                            <button onClick={() => setAnalysisComplete(false)} className="text-xs underline mt-2 hover:text-green-800">Reset</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: Review Scores */}
                            {analysisComplete && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex items-start gap-3">
                                        <Info className="shrink-0 mt-0.5" size={16} />
                                        <p><strong>System Insight:</strong> We've auto-populated the 19 strategic dimensions below based on your text. Please fine-tune the sliders if you have deeper insider knowledge.</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                                        {Object.entries(newBizScores).map(([key, value]) => (
                                            <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                                    <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{value}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={value}
                                                    onChange={(e) => setNewBizScores({ ...newBizScores, [key]: parseInt(e.target.value) })}
                                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                />
                                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                                    <span>Low</span>
                                                    <span>High</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-slate-200">
                                        <button
                                            onClick={handleAddBusiness}
                                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl transform hover:-translate-y-0.5 text-lg"
                                        >
                                            Add {newBizName} to Dashboard
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* Pattern Analysis Modal */}
            {showPatternModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Brain className="text-indigo-600" />
                                Pattern Understanding
                            </h2>
                            <button onClick={() => setShowPatternModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Ask about patterns, correlations, or opportunities:</label>
                                    <textarea
                                        value={patternQuery}
                                        onChange={(e) => setPatternQuery(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none text-sm"
                                        placeholder="e.g., 'What is the correlation between shipping speed and quality in this dataset?' or 'Which business has the best unit economics?'"
                                    />
                                </div>

                                <button
                                    onClick={analyzePatterns}
                                    disabled={!patternQuery || isAnalyzingPattern}
                                    className="w-full py-3 bg-indigo-600 disabled:bg-indigo-300 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
                                >
                                    {isAnalyzingPattern ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                                    <span>{isAnalyzingPattern ? 'Analyzing...' : 'Ask AI'}</span>
                                </button>

                                {patternResult && (
                                    <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Analysis Result</h3>
                                        <div className="prose prose-sm text-slate-600 max-w-none whitespace-pre-wrap">
                                            {patternResult}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
