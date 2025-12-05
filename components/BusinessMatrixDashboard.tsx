'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, X, Check, Search, Info, TrendingUp, Shield, Cpu, Users, DollarSign, Brain, Globe, Activity, Layers, Target, Zap, Lock, BarChart3, RotateCcw, Copy, Download, Upload, FileJson, Calculator } from 'lucide-react';

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
        highHigh: 'Cash Cow',
        xStart: '0d', xEnd: '365d', yStart: '0%', yEnd: '100%'
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
        highHigh: 'SaaS Unicorn',
        xStart: '0d', xEnd: '365d', yStart: '0%', yEnd: '100%'
    },
    {
        id: 'freq-arpu',
        group: MATRIX_GROUPS.FINANCIALS,
        title: 'Freq Use/ARPU (1Year)',
        xAxis: 'Avg Use Frequency',
        yAxis: 'ARPU (1yr)',
        xKey: 'frequency',
        yKey: 'arpu',
        icon: Activity,
        lowLow: 'Low Value',
        lowHigh: 'Enterprise (One-off)',
        highLow: 'Ad/Micro-trans',
        highHigh: 'Recurring Enterprise',
        xStart: '0d', xEnd: '365d', yStart: '$1', yEnd: '$1M (Log)'
    },
    {
        id: 'freq-ltv',
        group: MATRIX_GROUPS.FINANCIALS,
        title: 'Freq Use/ARPU (5Years)',
        xAxis: 'Avg Use Frequency',
        yAxis: 'ARPU (5yr)',
        xKey: 'frequency',
        yKey: 'ltv',
        icon: TrendingUp,
        lowLow: 'Churn Factory',
        lowHigh: 'Consulting Model',
        highLow: 'Utility Subscription',
        highHigh: 'Compounder',
        xStart: '0d', xEnd: '365d', yStart: '$100', yEnd: '$10M (Log)'
    },
    {
        id: 'buying-freq-1y',
        group: MATRIX_GROUPS.FINANCIALS,
        title: 'Buying Freq (1 Year)',
        xAxis: 'Avg Use Frequency',
        yAxis: 'Buying Frequency',
        xKey: 'frequency',
        yKey: 'buyingFreq1y',
        icon: Activity,
        lowLow: 'Rare Purchase',
        lowHigh: 'Automated/Forced',
        highLow: 'Free/Ad-Supported',
        highHigh: 'Daily Transactor',
        xStart: 'Low', xEnd: 'High', yStart: '1/yr', yEnd: 'Daily'
    },
    {
        id: 'buying-freq-5y',
        group: MATRIX_GROUPS.FINANCIALS,
        title: 'Buying Freq (5 Years)',
        xAxis: 'Avg Use Frequency',
        yAxis: 'Buying Frequency',
        xKey: 'frequency',
        yKey: 'buyingFreq5y',
        icon: TrendingUp,
        lowLow: 'One-off',
        lowHigh: 'Recurring Utility',
        highLow: 'Engaged Free',
        highHigh: 'Loyal Subscriber',
        xStart: 'Low', xEnd: 'High', yStart: '1/5yr', yEnd: 'Daily'
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
        highHigh: 'Platform Giant',
        xStart: '$10M', xEnd: '$100B', yStart: '$1', yEnd: '$1M'
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
        highHigh: 'Market Leader',
        xStart: '$1M', xEnd: '$10B', yStart: '$1', yEnd: '$1M'
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
        highHigh: 'Monopoly',
        xStart: '$100k', xEnd: '$1B', yStart: '$1', yEnd: '$1M'
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
        highHigh: 'Enterprise Scale',
        xStart: '$0', xEnd: '$50k (CAC)', yStart: '$100', yEnd: '$1M (LTV)'
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
        highHigh: 'High Performer',
        xStart: 'Slow', xEnd: 'Fast', yStart: 'Low', yEnd: 'High'
    },
    {
        id: 'virality',
        group: MATRIX_GROUPS.PRODUCT,
        title: 'Advocacy NPS Potential',
        xAxis: 'Avg Use Frequency',
        yAxis: 'Number of avg opportunities to share prod (0-100)',
        xKey: 'frequency',
        yKey: 'shareOpp',
        icon: Users,
        lowLow: 'Secret Tool',
        lowHigh: 'Referral Driven',
        highLow: 'Habitual',
        highHigh: 'Social/Viral',
        xStart: '0d', xEnd: '365d', yStart: '0', yEnd: '100'
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
        highHigh: 'Invisible Tech',
        xStart: 'Simple', xEnd: 'Complex', yStart: '$1', yEnd: '$1M'
    },
    {
        id: 'pmf',
        group: MATRIX_GROUPS.PRODUCT,
        title: 'Product Market Fit',
        xAxis: 'Market Size Potential',
        yAxis: 'Customer Satisafction / Retention',
        xKey: 'marketSize',
        yKey: 'nps',
        icon: Check,
        lowLow: 'Pivot Needed',
        lowHigh: 'Cult Product',
        highLow: 'Leaky Bucket',
        highHigh: 'Scale Ready',
        xStart: 'Niche', xEnd: 'Mass', yStart: 'Low', yEnd: 'High'
    },
    {
        id: 'sales-friction',
        group: MATRIX_GROUPS.PRODUCT,
        title: 'Sales Friction',
        xAxis: 'Value Prop Clarity',
        yAxis: 'No Brainer Buy',
        xKey: 'clarity',
        yKey: 'buyability',
        icon: Layers,
        lowLow: 'Consultative Sale',
        lowHigh: 'Commodity',
        highLow: 'Visionary Sell',
        highHigh: 'PLG / Self-Serve',
        xStart: 'Unclear', xEnd: 'Clear', yStart: 'Long', yEnd: 'Instant'
    },

    // --- Row 4: Operations & Risk ---
    {
        id: 'risk-control',
        group: MATRIX_GROUPS.OPERATIONS,
        title: 'Operational Reliance',
        xAxis: 'Degree of control (dependencies)',
        yAxis: 'Operational Risk',
        xKey: 'control',
        yKey: 'risk',
        icon: Shield,
        lowLow: 'Platform Dependent',
        lowHigh: 'Gambling',
        highLow: 'Walled Garden',
        highHigh: 'Sovereign',
        xStart: 'Low', xEnd: 'High', yStart: 'Low', yEnd: 'High'
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
        highHigh: 'Moat',
        xStart: 'Simple', xEnd: 'Complex', yStart: '$1', yEnd: '$1M'
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
        highHigh: 'Top of Mind',
        xStart: '0d', xEnd: '365d', yStart: 'Weekly', yEnd: 'Daily'
    },
    {
        id: 'cyborg',
        group: MATRIX_GROUPS.OPERATIONS,
        title: 'Manual/Autonomous',
        xAxis: 'Freq of Human Input',
        yAxis: 'AI/Autonomous',
        xKey: 'humanInput',
        yKey: 'aiAutonomy',
        icon: Cpu,
        lowLow: 'Legacy Tool',
        lowHigh: 'Black Box',
        highLow: 'Consultancy',
        highHigh: 'Co-Pilot',
        xStart: '0% (Auto)', xEnd: '100% (Manual)', yStart: '0 Auto', yEnd: '100% Auto'
    },
    {
        id: 'leverage',
        group: MATRIX_GROUPS.OPERATIONS,
        title: 'Output Leverage',
        xAxis: '1 year time',
        yAxis: 'Output in USD',
        xKey: 'timeInput',
        yKey: 'output',
        icon: TrendingUp,
        lowLow: 'Slog',
        lowHigh: 'High Leverage',
        highLow: 'Service Biz',
        highHigh: 'Software Scale',
        xStart: '0 hrs', xEnd: '2000 hrs', yStart: '$0', yEnd: '$10M'
    },
    {
        id: 'gender-distribution',
        group: MATRIX_GROUPS.MARKET,
        title: 'Customer Gender Distribution',
        xAxis: 'Women % of Customers',
        yAxis: 'Men % of Customers',
        xKey: 'womenPercent',
        yKey: 'menPercent',
        icon: Users,
        lowLow: 'Undefined Segment',
        lowHigh: 'Male Dominated',
        highLow: 'Female Dominated',
        highHigh: 'Balanced Demographics',
        xStart: '0%', xEnd: '100%', yStart: '0%', yEnd: '100%'
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

            humanInput: 80, aiAutonomy: 40, timeInput: 50, output: 85,
            buyingFreq1y: 70, buyingFreq5y: 75,
            womenPercent: 45, menPercent: 52
        },
        // We duplicate scores to initialScores to allow "Reset to Default"
        initialScores: {
            frequency: 60, netMargin: 15, grossMargin: 40, arpu: 70, ltv: 85,
            tam: 95, sam: 90, som: 80, cac: 60,
            shippingSpeed: 95, quality: 90, shareOpp: 20, cognitiveLoad: 20,
            marketSize: 95, csat: 80, clarity: 90, buyability: 85,
            control: 90, risk: 40, complexity: 95, mindShare: 85,

            humanInput: 80, aiAutonomy: 40, timeInput: 50, output: 85,
            buyingFreq1y: 70, buyingFreq5y: 75,
            womenPercent: 45, menPercent: 52
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
            humanInput: 60, aiAutonomy: 85, timeInput: 20, output: 90,
            buyingFreq1y: 40, buyingFreq5y: 45,
            womenPercent: 50, menPercent: 48
        },
        initialScores: {
            frequency: 90, netMargin: 30, grossMargin: 85, arpu: 40, ltv: 75,
            tam: 80, sam: 70, som: 60, cac: 30,
            shippingSpeed: 80, quality: 75, shareOpp: 85, cognitiveLoad: 70,
            marketSize: 85, csat: 85, clarity: 60, buyability: 80,
            control: 95, risk: 20, complexity: 60, mindShare: 80,
            humanInput: 60, aiAutonomy: 85, timeInput: 20, output: 90,
            buyingFreq1y: 40, buyingFreq5y: 45,
            womenPercent: 50, menPercent: 48
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

            {/* Chart Wrapper with space for axes */}
            <div className="relative pl-28 pt-8 pb-6 pr-2">
                {/* Y Axis Label - Top Center */}
                <div className="absolute top-0 left-28 right-2 flex items-center justify-center pointer-events-none h-8">
                    <span className="text-xs font-bold text-red-600 whitespace-nowrap tracking-wider">{matrix.yAxis}</span>
                </div>

                {/* X Axis Label - Left Center (Horizontal) */}
                <div className="absolute left-0 top-8 bottom-6 w-28 flex items-center justify-end pr-3 pointer-events-none">
                    <span className="text-xs font-bold text-red-600 whitespace-nowrap tracking-wider">{matrix.xAxis}</span>
                </div>

                {/* Y Axis Start/End Labels */}
                <div className="absolute left-20 top-8 w-8 text-center pointer-events-none">
                    <span className="text-[10px] text-slate-400 leading-none block mt-1">{matrix.yEnd}</span>
                </div>
                <div className="absolute left-20 bottom-6 w-8 text-center pointer-events-none">
                    <span className="text-[10px] text-slate-400 leading-none block mb-1">{matrix.yStart}</span>
                </div>

                {/* Chart Area */}
                <div
                    ref={containerRef}
                    className="relative aspect-square w-full bg-white border border-slate-200 rounded-lg cursor-crosshair overflow-hidden"
                >

                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                        <div className="w-1/2 border-r border-slate-200 border-dashed h-full"></div>
                        <div className="w-1/2 h-full"></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col pointer-events-none">
                        <div className="h-1/2 border-b border-slate-200 border-dashed w-full"></div>
                        <div className="h-1/2 w-full"></div>
                    </div>

                    {/* Quadrant Labels */}
                    <span className="absolute top-2 left-2 text-[9px] text-slate-400 font-medium leading-tight max-w-[45%] pointer-events-none">{matrix.highLow}</span>
                    <span className="absolute top-2 right-2 text-[9px] text-slate-400 font-medium text-right leading-tight max-w-[45%] pointer-events-none">{matrix.highHigh}</span>
                    <span className="absolute bottom-2 left-2 text-[9px] text-slate-400 font-medium leading-tight max-w-[45%] pointer-events-none">{matrix.lowLow}</span>
                    <span className="absolute bottom-2 right-2 text-[9px] text-slate-400 font-medium text-right leading-tight max-w-[45%] pointer-events-none">{matrix.lowHigh}</span>

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
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 bg-neutral-800 text-white text-xs rounded p-2 z-50 pointer-events-none shadow-lg border border-neutral-700">
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

                {/* X Axis Start/End Labels */}
                <div className="absolute bottom-0 left-28 h-6 flex items-center pointer-events-none pl-1">
                    <span className="text-[10px] text-slate-400 leading-none">{matrix.xStart}</span>
                </div>
                <div className="absolute bottom-0 right-2 h-6 flex items-center pointer-events-none pr-1">
                    <span className="text-[10px] text-slate-400 leading-none">{matrix.xEnd}</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Application ---

export default function BusinessMatrixDashboard() {
    const [businesses, setBusinesses] = useState(INITIAL_BUSINESSES);
    const [showAddModal, setShowAddModal] = useState(false);

    // Import/Export State
    const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
    const [jsonInput, setJsonInput] = useState('');
    const [importError, setImportError] = useState('');
    const [importSuccess, setImportSuccess] = useState('');

    // Initialize all possible score keys to 50
    const initialScores = useMemo(() => {
        const keys = new Set<string>();
        MATRICES.forEach(m => { keys.add(m.xKey); keys.add(m.yKey); });
        return Array.from(keys).reduce((acc, key) => ({ ...acc, [key]: 50 }), {} as Record<string, number>);
    }, []);

    const [newBizScores, setNewBizScores] = useState(initialScores);

    const handleImport = () => {
        if (!jsonInput) return;
        setImportError('');
        setImportSuccess('');

        try {
            const parsed = JSON.parse(jsonInput);
            const businessesToAdd = Array.isArray(parsed) ? parsed : [parsed];

            // Basic validation
            const validBusinesses = businessesToAdd.map((b: any, index: number) => {
                if (!b.name) throw new Error(`Item ${index + 1} missing 'name'`);

                // Ensure scores exist or use defaults
                const scores = { ...initialScores, ...(b.scores || {}) };

                // Generate ID and color if missing
                const newId = Math.max(...businesses.map(b => b.id), 0) + index + 1;
                const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];

                return {
                    id: b.id || newId,
                    name: b.name,
                    color: b.color || randomColor,
                    desc: b.desc || '',
                    scores: scores,
                    initialScores: scores, // Set initial to current for reset
                    reasoning: b.reasoning || "Imported via JSON"
                };
            });

            setBusinesses(prev => [...prev, ...validBusinesses]);
            setImportSuccess(`Successfully imported ${validBusinesses.length} business(es)`);
            setJsonInput('');
            setTimeout(() => {
                setShowAddModal(false);
                setImportSuccess('');
            }, 1500);

        } catch (error: any) {
            console.error('Import failed:', error);
            setImportError(error.message || 'Invalid JSON format');
        }
    };

    const handleCopyToClipboard = () => {
        const jsonString = JSON.stringify(businesses, null, 2);
        navigator.clipboard.writeText(jsonString);
        setImportSuccess('Copied to clipboard!');
        setTimeout(() => setImportSuccess(''), 2000);
    };



    const resetForm = () => {
        setJsonInput('');
        setImportError('');
        setImportSuccess('');
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



    return (
        <div className="min-h-screen bg-gray-400 text-slate-200 font-sans">

            {/* Top Navigation Bar */}
            <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30 shadow-sm">
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
                        <Link
                            href="/pricing"
                            className="flex items-center gap-2 bg-neutral-900 text-slate-400 hover:text-indigo-400 hover:bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-lg font-medium transition-all shadow-sm text-sm md:text-base"
                        >
                            <Calculator size={18} />
                            Pricing Simulator
                        </Link>
                        <button
                            onClick={() => {
                                setShowAddModal(true);
                                setActiveTab('import');
                            }}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm md:text-base"
                        >
                            <FileJson size={18} />
                            Manage Data
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-[1600px] mx-auto px-4 py-8">

                {/* Active Businesses Filters */}
                <div className="mb-8 flex flex-wrap gap-4 items-center bg-neutral-900 p-4 rounded-xl border border-neutral-800 shadow-sm">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Entities:</span>
                    {businesses.map(b => (
                        <div key={b.id} className="flex items-center gap-2 bg-neutral-800 pl-3 pr-2 py-1.5 rounded-full border border-neutral-700 shadow-sm group">
                            <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: b.color }}></span>
                            <span className="font-bold text-sm text-slate-200">{b.name}</span>

                            <div className="flex items-center gap-1 border-l border-neutral-600 pl-2 ml-1">
                                <button
                                    onClick={() => resetBusinessToDefault(b.id)}
                                    title="Reset to default analysis position"
                                    className="text-slate-400 hover:text-indigo-400 transition-colors p-1 rounded-md hover:bg-neutral-700"
                                >
                                    <RotateCcw size={12} />
                                </button>
                                <button
                                    onClick={() => deleteBusiness(b.id)}
                                    title="Remove business"
                                    className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-neutral-700"
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
                            <div className="flex items-center gap-2 mb-6 border-b border-neutral-800 pb-2">
                                <Layers className="text-indigo-500" size={20} />
                                <h2 className="text-xl font-bold text-slate-200">{groupName}</h2>
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

            {/* Import/Export Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-neutral-800">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 shrink-0">
                            <h2 className="text-xl font-bold text-slate-200">Data Manager</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-neutral-800">
                            <button
                                onClick={() => setActiveTab('import')}
                                className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'import' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Upload size={16} />
                                    Import JSON
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('export')}
                                className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'export' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Download size={16} />
                                    Export JSON
                                </div>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

                            {activeTab === 'import' && (
                                <div className="space-y-4 h-full flex flex-col">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex items-start gap-3">
                                        <Info className="shrink-0 mt-0.5" size={16} />
                                        <p>Paste a JSON array of business objects or a single business object. Each object should have a <strong>name</strong> and optional <strong>scores</strong>.</p>
                                    </div>

                                    <textarea
                                        value={jsonInput}
                                        onChange={(e) => setJsonInput(e.target.value)}
                                        className="w-full flex-1 p-4 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-[300px]"
                                        placeholder={`[\n  {\n    "name": "New Business",\n    "scores": { "frequency": 80, "netMargin": 40 }\n  }\n]`}
                                    />

                                    {importError && (
                                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                                            Error: {importError}
                                        </div>
                                    )}

                                    {importSuccess && (
                                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                                            <Check size={16} /> {importSuccess}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleImport}
                                        disabled={!jsonInput}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold transition-colors shadow-lg"
                                    >
                                        Import Data
                                    </button>
                                </div>
                            )}

                            {activeTab === 'export' && (
                                <div className="space-y-4 h-full flex flex-col">
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600">
                                        Current state of all businesses in JSON format. Copy this to save your data or transfer it to another session.
                                    </div>

                                    <textarea
                                        readOnly
                                        value={JSON.stringify(businesses, null, 2)}
                                        className="w-full flex-1 p-4 border text-slate-800 border-slate-300 rounded-lg font-mono text-xs bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-[300px]"
                                    />

                                    {importSuccess && (
                                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                                            <Check size={16} /> {importSuccess}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleCopyToClipboard}
                                        className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Copy size={18} />
                                        Copy to Clipboard
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}




        </div >
    );
}
