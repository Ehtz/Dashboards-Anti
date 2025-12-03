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
    ArrowLeft
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
            <div className="text-xs text-rose-500 text-right font-medium mt-1">
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
    const [growthRate, setGrowthRate] = useState(5); // Monthly Growth Rate %

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
    // Logic: Current Customers * (1 + GrowthRate)^Month
    const timeChartData = useMemo(() => {
        const points = [];
        const months = 12;

        for (let i = 0; i <= months; i++) {
            const projectedCustomers = totalCustomers * Math.pow(1 + growthRate / 100, i);
            const revenue = projectedCustomers * metrics.arpu;
            const profit = revenue * (grossMargin / 100);

            points.push({
                x: i,
                y: chartMode === 'revenue' ? revenue : profit
            });
        }
        const maxY = points[points.length - 1].y;
        // Increase maxY slightly so the line isn't at the very top pixel
        return { points, maxX: months, maxY: maxY > 0 ? maxY * 1.2 : 100, type: 'time' };
    }, [metrics.arpu, totalCustomers, chartMode, grossMargin, growthRate]);


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

        const scaleX = (val) => (val / data.maxX) * chartW + padding;
        // For flat line charts, we want a fixed range or dynamic? 
        // Using dynamic maxY from data ensures it fits.
        const scaleY = (val) => height - padding - (val / data.maxY) * chartH;

        const pathD = data.points.map((p, i) =>
            `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`
        ).join(' ');

        const areaD = `${pathD} L ${scaleX(data.points[data.points.length - 1].x)} ${height - padding} L ${padding} ${height - padding} Z`;

        const lineColor = chartMode === 'revenue' ? '#4f46e5' : '#10b981';

        // Generate ticks based on chart type
        const ticks = data.type === 'time' ? [0, 3, 6, 9, 12] : [0, 0.5, 1];

        return (
            <div className="w-full h-full overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {/* Y-Axis Grid & Labels */}
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

                    {/* Active Marker (Current State) */}
                    {data.type === 'scale' && (
                        <circle
                            cx={scaleX(totalCustomers)}
                            cy={scaleY(chartMode === 'revenue' ? totalCustomers * metrics.arpu : totalCustomers * metrics.grossProfitPerUser)}
                            r="6"
                            className={`${chartMode === 'revenue' ? 'fill-indigo-600' : 'fill-emerald-500'} stroke-white stroke-2`}
                        />
                    )}

                    {/* End Marker (For Time Chart) */}
                    {data.type === 'time' && (
                        <circle
                            cx={scaleX(data.maxX)}
                            cy={scaleY(data.points[data.points.length - 1].y)}
                            r="6"
                            className={`${chartMode === 'revenue' ? 'fill-indigo-600' : 'fill-emerald-500'} stroke-white stroke-2`}
                        />
                    )}

                    {/* X-Axis Labels */}
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

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto">

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
                    <p className="text-slate-500 mt-2 text-lg">
                        Model your pricing strategy, unit economics, and earnings potential.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN: Controls */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Customer Scale (New) */}
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
                            <InputGroup
                                label="Monthly Growth Rate"
                                value={growthRate}
                                onChange={setGrowthRate}
                                min={0} max={30} suffix="%"
                                helpText="Expected month-over-month customer growth."
                                caption={`+${Math.round(totalCustomers * (Math.pow(1 + growthRate / 100, 12) - 1))} new cust. in 1 yr`}
                            />
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
                                        <span className="opacity-75"> ({metrics.churnedARR.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} /yr)</span>
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
                                caption={`${100 - expansionRate}% stay on base plan`}
                            />
                            <InputGroup
                                label="Price Per Extra Seat"
                                value={pricePerSeat}
                                onChange={setPricePerSeat}
                                min={0} max={100} prefix="$"
                                helpText="Cost for each user beyond the included amount."
                            />
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Model Assumptions</p>
                                <InputGroup
                                    label="Avg. Seats (Exp. Users)"
                                    value={avgSeatsPerAccount}
                                    onChange={setAvgSeatsPerAccount}
                                    min={1} max={50}
                                    helpText="Average team size for customers who expand."
                                />
                            </div>
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

                        {/* CHART 1: Scale Projection */}
                        <Card className="p-6 overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Scaling Projection</h3>
                                        <p className="text-xs text-slate-400">Revenue vs. Customer Count</p>
                                    </div>

                                    {/* Chart Toggle */}
                                    <div className="flex bg-slate-100 p-1 rounded-lg ml-4">
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

                                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full self-start md:self-auto">
                                    <span className="text-xs font-medium text-slate-500">Current Scale:</span>
                                    <input
                                        type="number"
                                        value={totalCustomers}
                                        onChange={(e) => setTotalCustomers(Number(e.target.value))}
                                        className="w-16 bg-transparent text-sm font-bold text-slate-800 focus:outline-none border-b border-slate-300 focus:border-indigo-500 text-right"
                                    />
                                    <span className="text-xs text-slate-500">customers</span>
                                </div>
                            </div>

                            <div className="h-64 md:h-72 w-full bg-slate-50 rounded-lg border border-slate-100 relative">
                                <Chart
                                    data={scaleChartData}
                                    xFormatter={(val) => `${Math.round(val)} cust.`}
                                />
                            </div>
                        </Card>

                        {/* CHART 2: Time Projection (Modified - With Growth Rate) */}
                        <Card className="p-6 overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">12-Month Forecast</h3>
                                        <p className="text-xs text-slate-400">Projected Run Rate (Dynamic Growth)</p>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 italic">
                                    Based on {growthRate}% monthly customer growth
                                </div>
                            </div>

                            <div className="h-64 md:h-72 w-full bg-slate-50 rounded-lg border border-slate-100 relative">
                                <Chart
                                    data={timeChartData}
                                    xFormatter={(val) => val === 0 ? 'Now' : `Mo ${val}`}
                                />
                            </div>
                        </Card>

                        {/* Customer Profile Comparison */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Standard Plan Card */}
                            <Card className="p-4 flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <Package size={48} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-500">Standard User</div>
                                    <div className="text-2xl font-bold text-slate-800 mt-1">${basePrice.toFixed(0)}<span className="text-sm font-normal text-slate-400">/mo</span></div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        <span className="font-semibold">{metrics.standardUserCount.toLocaleString()}</span> customers
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">Segment MRR</span>
                                        <span className="text-sm font-bold text-slate-700">${metrics.totalRevenueFromStandard.toLocaleString()}</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Expansion Plan Card */}
                            <Card className="p-4 flex flex-col justify-between relative overflow-hidden border-indigo-200 bg-indigo-50/30">
                                <div className="absolute top-0 right-0 p-2 opacity-10 text-indigo-600">
                                    <Users size={48} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-indigo-600">Expanded User</div>
                                    <div className="text-2xl font-bold text-indigo-700 mt-1">${metrics.expandedUserRevenue.toFixed(0)}<span className="text-sm font-normal text-indigo-400">/mo</span></div>
                                    <div className="text-xs text-indigo-500 mt-1 flex gap-1">
                                        <span>${basePrice} base</span> + <span>${metrics.expansionCostOnly.toFixed(0)} seats</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-indigo-200/50">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-indigo-600">Segment MRR</span>
                                        <span className="text-sm font-bold text-indigo-700">${metrics.totalRevenueFromExpanded.toLocaleString()}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Revenue Stack */}
                            <Card className="p-0 overflow-hidden h-full">
                                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
                                    <BarChart3 size={18} className="text-slate-500" />
                                    <h3 className="font-semibold text-slate-700 text-sm">Revenue Breakdown</h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    <div className="p-4 flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-slate-800">Base Subscription</div>
                                            <div className="text-xs text-slate-500">Fixed monthly fee</div>
                                        </div>
                                        <div className="font-mono font-bold text-slate-700">${basePrice.toFixed(2)}</div>
                                    </div>

                                    <div className="p-4 flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-slate-800">Expansion Revenue</div>
                                            <div className="text-xs text-slate-500">
                                                {expansionRate}% add ~{metrics.billableSeatsPerExpander} extra seats
                                            </div>
                                        </div>
                                        <div className="font-mono font-bold text-emerald-600">+${metrics.seatRevenue.toFixed(2)}</div>
                                    </div>

                                    <div className="p-4 flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-slate-800">Upsell Avg</div>
                                            <div className="text-xs text-slate-500">Weighted average</div>
                                        </div>
                                        <div className="font-mono font-bold text-emerald-600">+${metrics.avgUpsellRevenue.toFixed(2)}</div>
                                    </div>

                                    <div className="p-4 bg-indigo-50 flex justify-between items-center">
                                        <div><div className="font-bold text-indigo-900">Total ARPU</div></div>
                                        <div className="font-mono font-bold text-indigo-700">${metrics.arpu.toFixed(2)}</div>
                                    </div>
                                </div>
                            </Card>

                            {/* Unit Economics Analysis */}
                            <Card className="p-0 overflow-hidden h-full">
                                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
                                    <Activity size={18} className="text-slate-500" />
                                    <h3 className="font-semibold text-slate-700 text-sm">Efficiency Analysis</h3>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-xs font-medium text-slate-500">Customer Lifetime (avg)</span>
                                            <span className="text-xs font-bold text-slate-700">{(100 / churnRate).toFixed(1)} months</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                                            <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, (100 / churnRate) * 2)}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-xs font-medium text-slate-500">Real Profit per User</span>
                                            <span className="text-xs font-bold text-emerald-600">${metrics.grossProfitPerUser.toFixed(0)} / month</span>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            After {100 - grossMargin}% margin costs.
                                        </div>
                                    </div>

                                    <div className={`p-3 rounded-lg border ${metrics.ltvCacRatio >= 3 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`w-2 h-2 rounded-full ${metrics.ltvCacRatio >= 3 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                            <span className="text-xs font-bold uppercase text-slate-700">Verdict</span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            {metrics.ltvCacRatio >= 3
                                                ? "Healthy economics. You are making >3x your spend on every customer. You can afford to spend more on ads."
                                                : "Caution. Your LTV:CAC is low. Try lowering CAC, reducing churn, or increasing pricing to improve margins."}
                                        </p>
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