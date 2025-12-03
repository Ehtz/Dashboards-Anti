'use client';

import React, { useState, useMemo } from 'react';
import {
    Calculator,
    Users,
    TrendingUp,
    DollarSign,
    Package,
    Zap,
    BarChart3,
    Info,
    Scale,
    Activity,
    PieChart,
    Target,
    Calendar,
    ArrowLeft,
    AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
        {children}
    </div>
);

interface SectionHeaderProps {
    icon: React.ElementType;
    title: string;
    description?: string;
}

const SectionHeader = ({ icon: Icon, title, description }: SectionHeaderProps) => (
    <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Icon size={20} />
            </div>
            <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        {description && <p className="text-sm text-slate-500 ml-11">{description}</p>}
    </div>
);

interface InputGroupProps {
    label: string;
    value: number | string;
    onChange: (val: number) => void;
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
    step?: number;
    helpText?: string;
    caption?: React.ReactNode;
    className?: string;
}

const InputGroup = ({ label, value, onChange, prefix = "", suffix = "", min = 0, max = 1000, step = 1, helpText, caption, className = "" }: InputGroupProps) => (
    <div className={`mb-4 ${className}`}>
        <div className="flex justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                {label}
                {helpText && (
                    <div className="group relative cursor-help">
                        <Info size={12} className="text-slate-400" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 w-48 text-center shadow-lg">
                            {helpText}
                        </div>
                    </div>
                )}
            </label>
            <span className="text-sm font-bold text-indigo-600 font-mono">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </span>
        </div>
        <div className="relative flex items-center h-6">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
        </div>
        {caption && (
            <div className="text-xs text-slate-500 text-right font-medium mt-1">
                {caption}
            </div>
        )}
    </div>
);

interface StatCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    highlight?: boolean;
    alert?: boolean;
}

const StatCard = ({ label, value, subtext, highlight = false, alert = false }: StatCardProps) => (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-indigo-600 border-indigo-600 text-white' : alert ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
        <div className={`text-sm font-medium mb-1 ${highlight ? 'text-indigo-100' : 'text-slate-500'}`}>{label}</div>
        <div className={`text-2xl font-bold font-mono tracking-tight ${alert ? 'text-amber-700' : ''}`}>{value}</div>
        {subtext && <div className={`text-xs mt-1 ${highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{subtext}</div>}
    </div>
);

export default function SaaSPricingCalculator() {
    // --- State ---

    // Pricing Model
    const [basePrice, setBasePrice] = useState(49);
    const [includedSeats, setIncludedSeats] = useState(1);
    const [pricePerSeat, setPricePerSeat] = useState(15);

    // Upsells
    const [upsellPrice, setUpsellPrice] = useState(99);
    const [upsellTakeRate, setUpsellTakeRate] = useState(20); // Percentage

    // Customer Assumptions
    const [expansionRate, setExpansionRate] = useState(30); // % of customers who expand
    const [avgSeatsPerAccount, setAvgSeatsPerAccount] = useState(5); // Now represents "Avg Seats per Expanded Account"
    const [totalCustomers, setTotalCustomers] = useState(100);
    const [yearlyGrowthRate, setYearlyGrowthRate] = useState(60); // Yearly Growth Rate %
    const [monthlyNewCustomers, setMonthlyNewCustomers] = useState(5); // Linear growth component

    // Unit Economics (The "Add them" metrics)
    const [churnRate, setChurnRate] = useState(5); // Monthly churn %
    const [cac, setCac] = useState(200); // Customer Acquisition Cost
    const [grossMargin, setGrossMargin] = useState(85); // Gross Margin %

    // View State
    const [chartMode, setChartMode] = useState('revenue'); // 'revenue' or 'profit'

    // --- Calculations ---

    const metrics = useMemo(() => {
        // 1. Calculate Revenue Per Account (ARPU)

        // Expansion Revenue (Weighted)
        // Only 'expansionRate'% of users are billed for extra seats. 
        // The rest are on base plan (0 extra cost).
        const billableSeatsPerExpander = Math.max(0, avgSeatsPerAccount - includedSeats);
        const weightedSeatRevenue = (billableSeatsPerExpander * pricePerSeat) * (expansionRate / 100);

        // Upsell Revenue
        const avgUpsellRevenue = upsellPrice * (upsellTakeRate / 100);

        // Total ARPU
        const arpu = basePrice + weightedSeatRevenue + avgUpsellRevenue;

        // Calculate Specific User Profile Revenues (for visualization)
        const expandedUserRevenue = basePrice + (billableSeatsPerExpander * pricePerSeat);
        const expansionCostOnly = billableSeatsPerExpander * pricePerSeat;

        // Segment Counts
        const expandedUserCount = Math.round(totalCustomers * (expansionRate / 100));
        const standardUserCount = totalCustomers - expandedUserCount;

        // Segment Totals
        const totalRevenueFromExpanded = expandedUserCount * expandedUserRevenue;
        const totalRevenueFromStandard = standardUserCount * basePrice;

        // 2. Totals
        const mrr = arpu * totalCustomers;
        const arr = mrr * 12;

        // 3. Unit Economics
        // Gross Profit per User = ARPU * Margin %
        const grossProfitPerUser = arpu * (grossMargin / 100);
        const totalGrossProfit = mrr * (grossMargin / 100);

        // Churn Impact
        const churnedMRR = mrr * (churnRate / 100);
        const churnedARR = churnedMRR * 12;

        // Lifetime Value (LTV) = Gross Profit / Churn Rate
        // Note: Using Gross Profit for LTV is more accurate than just Revenue
        const ltv = churnRate > 0 ? grossProfitPerUser / (churnRate / 100) : 0;

        // Payback Period (Months) = CAC / Gross Profit per User (Monthly)
        const paybackPeriod = grossProfitPerUser > 0 ? cac / grossProfitPerUser : 0;

        // LTV:CAC Ratio
        const ltvCacRatio = cac > 0 ? ltv / cac : 0;

        return {
            seatRevenue: weightedSeatRevenue,
            avgUpsellRevenue,
            arpu,
            mrr,
            arr,
            billableSeatsPerExpander,
            ltv,
            paybackPeriod,
            ltvCacRatio,
            grossProfitPerUser,
            totalGrossProfit,
            churnedMRR,
            churnedARR,
            expandedUserRevenue,
            expansionCostOnly,
            totalRevenueFromExpanded,
            totalRevenueFromStandard,
            expandedUserCount,
            standardUserCount
        };
    }, [basePrice, includedSeats, pricePerSeat, upsellPrice, upsellTakeRate, avgSeatsPerAccount, totalCustomers, churnRate, cac, grossMargin, expansionRate]);

    // --- Chart Data Generation ---

    // Data for "Scaling" chart (Revenue vs Customers)
    const scaleChartData = useMemo(() => {
        const points = [];
        const steps = 10;
        const maxCust = Math.max(200, totalCustomers * 2);

        for (let i = 0; i <= steps; i++) {
            const customers = Math.round((maxCust / steps) * i);
            const revenue = customers * metrics.arpu;
            const profit = revenue * (grossMargin / 100);

            points.push({
                x: customers,
                y: chartMode === 'revenue' ? revenue : profit
            });
        }
        return { points, maxX: maxCust, maxY: points[points.length - 1].y, type: 'scale' };
    }, [metrics.arpu, totalCustomers, chartMode, grossMargin]);

    // Data for "Time" chart (Revenue vs Months)
    // Logic: Start from 0 (or current) and apply growth
    const timeChartData = useMemo(() => {
        const points = [];
        const months = 12;
        let currentCust = totalCustomers; // Start from current
        // If user wants to see "from 0", they can set totalCustomers to 0.

        // Monthly Growth Rate derived from Yearly
        const monthlyGrowthRate = Math.pow(1 + yearlyGrowthRate / 100, 1 / 12) - 1;

        for (let i = 0; i <= months; i++) {
            const revenue = currentCust * metrics.arpu;
            const profit = revenue * (grossMargin / 100);

            points.push({
                x: i,
                y: chartMode === 'revenue' ? revenue : profit
            });

            // Compound Growth + Linear Growth
            currentCust = currentCust * (1 + monthlyGrowthRate) + monthlyNewCustomers;
        }

        const maxY = points[points.length - 1].y;
        return { points, maxX: months, maxY: maxY > 0 ? maxY * 1.2 : 100, type: 'time' };
    }, [metrics.arpu, totalCustomers, chartMode, grossMargin, yearlyGrowthRate, monthlyNewCustomers]);

    // --- Whale Curve Data Generation ---
    const whaleData = useMemo(() => {
        const N = 1000;

        // 1. Generate Segments
        // We need to construct a dataset where:
        // - Whales (50): High Profit
        // - High Perf (100): Med Profit
        // - Long Tail (750): Low Profit (Steady Margin)
        // - Unprofitable (100): Negative Profit (Drag)

        // Target Totals (Arbitrary units, we will normalize)
        // Let's say Total Final Profit = 1000 units.
        // Peak Profit = 1250 units (125%).
        // Unprofitable Drag = -250 units.

        // Distribution of Positive Profit (1250 units):
        // Whales (50): 20% of Total Final (200 units) -> 4 units/cust
        // High Perf (100): 40% of Total Final (400 units) -> 4 units/cust (Wait, user said "Top ~15% account for ~60%". 50+100=150 (15%). 200+400=600 (60%). Matches.)
        // Long Tail (750): Remaining to reach 1250. 1250 - 600 = 650 units. -> 0.86 units/cust.

        // Unprofitable (100): -250 units -> -2.5 units/cust.

        const customers = [];

        // Whales
        for (let i = 0; i < 50; i++) {
            const profit = 4 + (Math.random() * 0.5); // Add noise
            const margin = 0.90; // High margin
            const revenue = profit / margin;
            customers.push({ profit, revenue, margin });
        }

        // High Performers
        for (let i = 0; i < 100; i++) {
            const profit = 4 + (Math.random() * 0.5); // Similar profit to whales but maybe lower margin/higher rev? 
            // Actually user said "Whales: High Rev, Low Cost". "High Perf: Good Rev, Low Cost".
            // Let's make Whales slightly better.
            // Adjusted: Whales Profit = 5, High Perf Profit = 3.5.
            // 50 * 5 = 250. 100 * 3.5 = 350. Total = 600. Perfect.
            const margin = 0.85;
            const revenue = profit / margin;
            customers.push({ profit, revenue, margin });
        }

        // Long Tail
        for (let i = 0; i < 750; i++) {
            // Total target: 650. 650 / 750 = 0.86
            const profit = 0.86 + (Math.random() * 0.1);
            const margin = 0.80; // "Steady 80% Profit Margin"
            const revenue = profit / margin;
            customers.push({ profit, revenue, margin });
        }

        // Unprofitable Tail
        for (let i = 0; i < 100; i++) {
            // Target: -250. -250 / 100 = -2.5
            const profit = -2.5 + (Math.random() * 0.5);
            // "Medium Revenue, EXTREMELY High Cost"
            // Rev = 2 (Medium), Cost = 4.5 -> Profit = -2.5
            const revenue = 2 + (Math.random() * 0.5);
            // Margin = Profit / Revenue (Negative)
            const margin = profit / revenue;
            customers.push({ profit, revenue, margin });
        }

        // 2. Sort by Profit Descending
        customers.sort((a, b) => b.profit - a.profit);

        // 3. Calculate Cumulative
        let cumProfit = 0;
        let cumRev = 0;
        const totalNetProfit = customers.reduce((sum, c) => sum + c.profit, 0);

        const points = customers.map((c, i) => {
            cumProfit += c.profit;
            cumRev += c.revenue;

            return {
                x: ((i + 1) / N) * 100, // Percentile
                profitPct: (cumProfit / totalNetProfit) * 100,
                marginPct: (cumProfit / cumRev) * 100
            };
        });

        return { points, maxProfitPct: Math.max(...points.map(p => p.profitPct)) };
    }, []); // Static synthetic data

    // --- SVG Chart Helpers ---

    const Chart = ({ data, height = 240, xFormatter }: {
        data: { points: { x: number; y: number }[]; maxX: number; maxY: number; type: string };
        height?: number;
        xFormatter: (val: number) => string
    }) => {
        const padding = 40;
        const width = 600;
        const chartW = width - padding * 2;
        const chartH = height - padding * 2;

        const scaleX = (val: number) => (val / data.maxX) * chartW + padding;
        const scaleY = (val: number) => height - padding - (val / data.maxY) * chartH;

        const pathD = data.points.map((p, i) =>
            `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`
        ).join(' ');

        const areaD = `${pathD} L ${scaleX(data.points[data.points.length - 1].x)} ${height - padding} L ${padding} ${height - padding} Z`;

        const lineColor = chartMode === 'revenue' ? '#4f46e5' : '#10b981';

        const ticks = data.type === 'time' ? [0, 3, 6, 9, 12] : [0, 0.5, 1];

        return (
            <div className="w-full h-full overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
                        <g key={tick}>
                            <line
                                x1={padding}
                                y1={scaleY(data.maxY * tick)}
                                x2={width - padding}
                                y2={scaleY(data.maxY * tick)}
                                stroke="#e2e8f0"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={padding - 10}
                                y={scaleY(data.maxY * tick) + 4}
                                textAnchor="end"
                                className="text-[10px] fill-slate-400 font-mono"
                            >
                                ${(data.maxY * tick / 1000).toFixed(1)}k
                            </text>
                        </g>
                    ))}
                    <defs>
                        <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="gradientProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={areaD} fill={`url(#gradient${chartMode === 'revenue' ? 'Revenue' : 'Profit'})`} />
                    <path d={pathD} fill="none" stroke={lineColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {data.type === 'scale' && (
                        <circle
                            cx={scaleX(totalCustomers)}
                            cy={scaleY(chartMode === 'revenue' ? totalCustomers * metrics.arpu : totalCustomers * metrics.grossProfitPerUser)}
                            r="6"
                            className={`${chartMode === 'revenue' ? 'fill-indigo-600' : 'fill-emerald-500'} stroke-white stroke-2`}
                        />
                    )}
                    {data.type === 'time' && (
                        <circle
                            cx={scaleX(data.maxX)}
                            cy={scaleY(data.points[data.points.length - 1].y)}
                            r="6"
                            className={`${chartMode === 'revenue' ? 'fill-indigo-600' : 'fill-emerald-500'} stroke-white stroke-2`}
                        />
                    )}
                    {ticks.map((tick) => {
                        const val = data.type === 'time' ? tick : data.maxX * tick;
                        return (
                            <text
                                key={tick}
                                x={scaleX(val)}
                                y={height - 10}
                                textAnchor="middle"
                                className="text-[10px] fill-slate-400 font-mono"
                            >
                                {xFormatter(val)}
                            </text>
                        );
                    })}
                </svg>
            </div>
        );
    };

    const WhaleChart = ({ data, type }: { data: { x: number; profitPct: number; marginPct: number }[]; type: 'profit' | 'margin' }) => {
        const height = 240;
        const padding = 40;
        const width = 600;
        const chartW = width - padding * 2;
        const chartH = height - padding * 2;

        // Scales
        const scaleX = (val: number) => (val / 100) * chartW + padding;

        // Y Scale depends on type
        // Profit: Min 0 (or neg?), Max ~130%
        // Margin: 0 to 100%
        const maxY = type === 'profit' ? 140 : 100;
        const minY = type === 'profit' ? 0 : 0;
        const scaleY = (val: number) => height - padding - ((val - minY) / (maxY - minY)) * chartH;

        const pathD = data.map((p, i) =>
            `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(type === 'profit' ? p.profitPct : p.marginPct)}`
        ).join(' ');

        const areaD = `${pathD} L ${scaleX(100)} ${height - padding} L ${padding} ${height - padding} Z`;

        return (
            <div className="w-full h-full overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {/* Grid */}
                    {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                        <line key={tick} x1={padding} y1={scaleY(maxY * tick)} x2={width - padding} y2={scaleY(maxY * tick)} stroke="#e2e8f0" strokeDasharray="4 4" />
                    ))}

                    {/* Reference Lines */}
                    {type === 'profit' && (
                        <line x1={padding} y1={scaleY(100)} x2={width - padding} y2={scaleY(100)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                    )}
                    {type === 'margin' && (
                        <line x1={padding} y1={scaleY(80)} x2={width - padding} y2={scaleY(80)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                    )}

                    <defs>
                        <linearGradient id="whaleGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="marginGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <path d={areaD} fill={`url(#${type === 'profit' ? 'whaleGradient' : 'marginGradient'})`} />
                    <path d={pathD} fill="none" stroke={type === 'profit' ? '#8b5cf6' : '#f59e0b'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Labels */}
                    <text x={padding - 10} y={scaleY(maxY)} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">{maxY}%</text>
                    <text x={padding - 10} y={scaleY(0)} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">0%</text>

                    <text x={width / 2} y={height - 10} textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">Customer Percentile (Top to Bottom)</text>
                </svg>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <header className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 transition-colors font-medium">
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white">
                            <Calculator size={24} />
                        </div>
                        SaaS Revenue Simulator
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN: Controls */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Customer Scale */}
                        <Card className="p-6">
                            <SectionHeader
                                icon={Target}
                                title="Customer Base"
                                description="Current active subscribers."
                            />
                            <InputGroup
                                label="Total Customers"
                                value={totalCustomers}
                                onChange={setTotalCustomers}
                                min={0} max={5000} step={10}
                                helpText="Number of active paying accounts."
                            />
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Growth Assumptions</p>
                                <InputGroup
                                    label="Yearly Growth Rate"
                                    value={yearlyGrowthRate}
                                    onChange={setYearlyGrowthRate}
                                    min={0} max={200} suffix="%"
                                    helpText="Expected year-over-year growth."
                                />
                                <InputGroup
                                    label="New Cust. / Month"
                                    value={monthlyNewCustomers}
                                    onChange={setMonthlyNewCustomers}
                                    min={0} max={100}
                                    helpText="Linear growth (net new adds)."
                                />
                            </div>
                        </Card>

                        {/* Unit Economics Controls */}
                        <Card className="p-6 border-l-4 border-l-emerald-500">
                            <SectionHeader
                                icon={Scale}
                                title="Unit Economics"
                                description="Cost & retention probabilities."
                            />
                            <InputGroup
                                label="Churn Rate (Monthly)"
                                value={churnRate}
                                onChange={setChurnRate}
                                min={0.5} max={15} step={0.5} suffix="%"
                                helpText="Probability of a customer cancelling each month."
                                caption={
                                    <span>
                                        -{metrics.churnedMRR.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} /mo
                                    </span>
                                }
                            />
                            <InputGroup
                                label="CAC"
                                value={cac}
                                onChange={setCac}
                                min={0} max={1000} prefix="$"
                                helpText="Cost to Acquire a Customer (Ads + Sales)."
                            />
                            <InputGroup
                                label="Gross Margin"
                                value={grossMargin}
                                onChange={setGrossMargin}
                                min={10} max={100} suffix="%"
                                helpText="Percent of revenue kept after server/support costs."
                            />
                        </Card>

                        {/* Base Pricing */}
                        <Card className="p-6">
                            <SectionHeader
                                icon={Package}
                                title="Base Subscription"
                                description="Core pricing structure."
                            />
                            <InputGroup
                                label="Base Monthly Price"
                                value={basePrice}
                                onChange={setBasePrice}
                                min={0} max={500} prefix="$"
                                helpText="The flat fee charged every month."
                            />
                            <InputGroup
                                label="Included Seats"
                                value={includedSeats}
                                onChange={setIncludedSeats}
                                min={1} max={20}
                                helpText="How many users are included in the base price?"
                            />
                        </Card>

                        {/* Expansion Revenue */}
                        <Card className="p-6">
                            <SectionHeader
                                icon={Users}
                                title="Expansion (Seats)"
                            />
                            <InputGroup
                                label="Expansion Adoption"
                                value={expansionRate}
                                onChange={setExpansionRate}
                                min={0} max={100} suffix="%"
                                helpText="Percentage of customers who add extra seats."
                            />
                            <InputGroup
                                label="Price Per Extra Seat"
                                value={pricePerSeat}
                                onChange={setPricePerSeat}
                                min={0} max={100} prefix="$"
                                helpText="Cost for each user beyond the included amount."
                            />
                            <InputGroup
                                label="Avg. Seats (Exp. Users)"
                                value={avgSeatsPerAccount}
                                onChange={setAvgSeatsPerAccount}
                                min={1} max={50}
                                helpText="Average team size for customers who expand."
                            />
                        </Card>

                        {/* Upsells */}
                        <Card className="p-6">
                            <SectionHeader
                                icon={Zap}
                                title="Upsells & Add-ons"
                            />
                            <InputGroup
                                label="Upsell Value"
                                value={upsellPrice}
                                onChange={setUpsellPrice}
                                min={0} max={1000} prefix="$"
                            />
                            <InputGroup
                                label="Take Rate"
                                value={upsellTakeRate}
                                onChange={setUpsellTakeRate}
                                min={0} max={100} suffix="%"
                                helpText="Probability of a customer buying the add-on."
                            />
                        </Card>

                    </div>

                    {/* RIGHT COLUMN: Results */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Top Level Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <StatCard
                                label="MRR"
                                value={`$${metrics.mrr.toLocaleString()}`}
                                subtext="Monthly Recurring"
                                highlight={true}
                            />
                            <StatCard
                                label="ARR"
                                value={`$${metrics.arr.toLocaleString()}`}
                                subtext="Annual Run Rate"
                            />
                            <StatCard
                                label="LTV"
                                value={`$${Math.round(metrics.ltv).toLocaleString()}`}
                                subtext="Lifetime Value (Gross)"
                            />
                            <StatCard
                                label="LTV:CAC"
                                value={`${metrics.ltvCacRatio.toFixed(1)}x`}
                                subtext="Target > 3.0x"
                                alert={metrics.ltvCacRatio < 3}
                            />
                            <StatCard
                                label="Payback"
                                value={`${metrics.paybackPeriod.toFixed(1)}mo`}
                                subtext="Months to recover CAC"
                                alert={metrics.paybackPeriod > 12}
                            />
                        </div>

                        {/* Projections Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* CHART 1: Scale Projection */}
                            <Card className="p-6 overflow-hidden">
                                <div className="flex flex-col justify-between mb-6 gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">Scaling Projection</h3>
                                            <p className="text-xs text-slate-400">Revenue vs. Customer Count</p>
                                        </div>
                                    </div>
                                    <div className="flex bg-slate-100 p-1 rounded-lg self-start">
                                        <button
                                            onClick={() => setChartMode('revenue')}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartMode === 'revenue' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Revenue
                                        </button>
                                        <button
                                            onClick={() => setChartMode('profit')}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartMode === 'profit' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Gross Profit
                                        </button>
                                    </div>
                                </div>

                                <div className="h-48 w-full bg-slate-50 rounded-lg border border-slate-100 relative">
                                    <Chart
                                        data={scaleChartData}
                                        height={192}
                                        xFormatter={(val) => `${Math.round(val)}`}
                                    />
                                </div>
                            </Card>

                            {/* CHART 2: Time Projection */}
                            <Card className="p-6 overflow-hidden">
                                <div className="flex flex-col justify-between mb-6 gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">12-Month Forecast</h3>
                                            <p className="text-xs text-slate-400">Based on {yearlyGrowthRate}% YoY Growth</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-48 w-full bg-slate-50 rounded-lg border border-slate-100 relative">
                                    <Chart
                                        data={timeChartData}
                                        height={192}
                                        xFormatter={(val) => val === 0 ? 'Now' : `Mo ${val}`}
                                    />
                                </div>
                            </Card>
                        </div>

                        {/* PROFIT WHALE CURVE SECTION */}
                        <div className="pt-6 border-t border-slate-200">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
                                    <PieChart size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Profitability Analysis</h2>
                                    <p className="text-sm text-slate-500">Customer Concentration & Whale Curve</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Whale Curve */}
                                <Card className="p-6">
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-slate-800">The "Whale Curve"</h3>
                                        <p className="text-xs text-slate-400">Cumulative Profit % by Customer Percentile</p>
                                    </div>
                                    <div className="h-48 w-full bg-slate-50 rounded-lg border border-slate-100 relative">
                                        <WhaleChart data={whaleData.points} type="profit" />
                                    </div>
                                    <div className="mt-4 text-xs text-slate-500 flex gap-4">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                                            <span>Peak: {Math.round(whaleData.maxProfitPct)}% of Profit</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                            <span>Bottom 10% destroy value</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Gross Margin Curve */}
                                <Card className="p-6">
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-slate-800">Gross Margin Curve</h3>
                                        <p className="text-xs text-slate-400">Cumulative Margin % by Customer Percentile</p>
                                    </div>
                                    <div className="h-48 w-full bg-slate-50 rounded-lg border border-slate-100 relative">
                                        <WhaleChart data={whaleData.points} type="margin" />
                                    </div>
                                    <div className="mt-4 text-xs text-slate-500">
                                        <p>Targeting ~80% margin until the unprofitable tail drags it down.</p>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Detailed Breakdown (Compact) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-0 overflow-hidden h-full">
                                <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2">
                                    <BarChart3 size={16} className="text-slate-500" />
                                    <h3 className="font-semibold text-slate-700 text-sm">Revenue Breakdown</h3>
                                </div>
                                <div className="divide-y divide-slate-100 text-sm">
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-slate-600">Base Subscription</span>
                                        <span className="font-mono font-bold text-slate-700">${basePrice.toFixed(2)}</span>
                                    </div>
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-slate-600">Expansion (Seats)</span>
                                        <span className="font-mono font-bold text-emerald-600">+${metrics.seatRevenue.toFixed(2)}</span>
                                    </div>
                                    <div className="p-3 flex justify-between items-center">
                                        <span className="text-slate-600">Upsell Avg</span>
                                        <span className="font-mono font-bold text-emerald-600">+${metrics.avgUpsellRevenue.toFixed(2)}</span>
                                    </div>
                                    <div className="p-3 bg-indigo-50 flex justify-between items-center">
                                        <span className="font-bold text-indigo-900">Total ARPU</span>
                                        <span className="font-mono font-bold text-indigo-700">${metrics.arpu.toFixed(2)}</span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-0 overflow-hidden h-full">
                                <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2">
                                    <Activity size={16} className="text-slate-500" />
                                    <h3 className="font-semibold text-slate-700 text-sm">Efficiency Analysis</h3>
                                </div>
                                <div className="p-3 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Real Profit / User</span>
                                        <span className="font-bold text-emerald-600">${metrics.grossProfitPerUser.toFixed(0)} / mo</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Customer Lifetime</span>
                                        <span className="font-bold text-slate-700">{(100 / churnRate).toFixed(1)} mo</span>
                                    </div>
                                    <div className={`p-2 rounded border text-xs ${metrics.ltvCacRatio >= 3 ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                                        {metrics.ltvCacRatio >= 3
                                            ? "Healthy LTV:CAC (>3x). Scale spend."
                                            : "Low LTV:CAC. Improve retention or pricing."}
                                    </div>
                                </div>
                            </Card>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}