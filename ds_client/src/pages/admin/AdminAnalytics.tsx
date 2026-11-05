import { useCallback, useEffect, useState } from "react";
import {
    Activity,
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    Banknote,
    Boxes,
    RefreshCw,
    ShoppingBag,
    Target,
    Users,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import api from "../../api/axios";

type Period = "7d" | "30d" | "90d" | "12m";

interface Metric {
    value: number;
    change_percent: number | null;
}

interface TrendPoint {
    label: string;
    revenue: number;
    orders: number;
}

interface CategoryPerformance {
    name: string;
    revenue: number;
    units_sold: number;
}

interface StatusData {
    status: string;
    count: number;
}

interface PaymentData {
    method: string;
    count: number;
    amount: number;
}

interface ProductData {
    id: number;
    name: string;
    units_sold: number;
    revenue: number;
}

interface LowStockProduct {
    id: number;
    name: string;
    stock: number;
}

interface RecentOrder {
    order_number: string;
    customer_name: string;
    total_amount: number | string;
    status: string;
    created_at: string;
}

interface BusinessInsight {
    title: string;
    description: string;
    severity: "info" | "warning" | "success";
}

interface AnalyticsData {
    revenue: Metric;
    orders: Metric;
    average_order_value: Metric;
    customers: Metric;
    repeat_customer_rate: Metric;
    conversion_rate: Metric | null;
    estimated_profit: Metric | null;
    low_stock_count: number;
    revenue_trend: TrendPoint[];
    category_performance: CategoryPerformance[];
    orders_by_status: StatusData[];
    payment_methods: PaymentData[];
    top_products: ProductData[];
    low_stock_products: LowStockProduct[];
    recent_orders: RecentOrder[];
    funnel: {
        visits: number | null;
        orders: number;
    };
    insights: BusinessInsight[];
}

const emptyData: AnalyticsData = {
    revenue: { value: 0, change_percent: null },
    orders: { value: 0, change_percent: null },
    average_order_value: { value: 0, change_percent: null },
    customers: { value: 0, change_percent: null },
    repeat_customer_rate: { value: 0, change_percent: null },
    conversion_rate: null,
    estimated_profit: null,
    low_stock_count: 0,
    revenue_trend: [],
    category_performance: [],
    orders_by_status: [],
    payment_methods: [],
    top_products: [],
    low_stock_products: [],
    recent_orders: [],
    funnel: { visits: null, orders: 0 },
    insights: [],
};

const chartColors = [
    "#4F46E5",
    "#0891B2",
    "#16A34A",
    "#EA580C",
    "#9333EA",
    "#DB2777",
];

const statusColors: Record<string, string> = {
    pending: "#F59E0B",
    paid: "#3B82F6",
    processing: "#8B5CF6",
    shipped: "#0891B2",
    delivered: "#16A34A",
    cancelled: "#EF4444",
    refunded: "#64748B",
};

const money = (value: number | string) =>
    `KES ${Number(value || 0).toLocaleString("en-KE", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    })}`;

const number = (value: number) =>
    value.toLocaleString("en-KE");

const titleCase = (value: string) =>
    value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

function Change({
    value,
}: {
    value: number | null;
}) {
    if (value === null || !Number.isFinite(value)) {
        return (
            <span className="text-xs text-gray-500">
                No comparison available
            </span>
        );
    }

    const positive = value >= 0;
    const Icon = positive ? ArrowUpRight : ArrowDownRight;

    return (
        <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${positive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
                }`}
        >
            <Icon size={15} />
            {Math.abs(value).toFixed(1)}% vs previous period
        </span>
    );
}

function MetricCard({
    title,
    value,
    change,
    icon: Icon,
}: {
    title: string;
    value: string;
    change: number | null;
    icon: typeof Banknote;
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="mt-2 wrap-break-word text-2xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </p>
                </div>

                <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                    <Icon size={22} />
                </div>
            </div>

            <div className="mt-4">
                <Change value={change} />
            </div>
        </div>
    );
}

function Panel({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">
                {title}
            </h2>

            {description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </p>
            )}

            <div className="mt-5">{children}</div>
        </section>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex h-full min-h-48 items-center justify-center text-center text-sm text-gray-500">
            {text}
        </div>
    );
}

export default function AdminAnalytics() {
    const [period, setPeriod] = useState<Period>("30d");
    const [data, setData] = useState<AnalyticsData>(emptyData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get<AnalyticsData>(
                "/orders/admin/analytics/advanced/",
                { params: { period } }
            );

            setData({ ...emptyData, ...response.data });
        } catch (err: any) {
            console.error("Analytics request failed:", err);
            setError("Could not load analytics. Check the API endpoint and your admin permissions.")
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        void loadAnalytics();
    }, [loadAnalytics]);

    return (
        <main className="space-y-6 pb-8 px-4 py-8 sm:px-6 lg:px-8">
            {/* Header and date filter */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="mb-2 bg-white rounded-xl py-3  px-3 shadow-sm  dark:bg-gray-800">
                    <p className="text-md text-gray-600 dark:text-white ">
                        Understand sales, customers, products, and store performance.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as Period)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        aria-label="Analytics date range"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="12m">Last 12 months</option>
                    </select>
                    <button
                        type="button"
                        onClick={() => void loadAnalytics()}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>
            </div>
            {error && (
                <div
                    role="alert"
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                >
                    <span>{error}</span>
                    <button
                        onClick={() => void loadAnalytics()}
                        className="font-semibold underline  hover:text-red-500 "
                    >
                        Retry
                    </button>
                </div>
            )}
            {loading && !error ? (
                <div className="flex min-h-64 items-center justify-center gap-3 text-gray-500">
                    <RefreshCw className="animate-spin" size={22} />
                    Loading business insights...
                </div>
            ) : !error ? (
                <>
                    {/* Key performance indicators */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard
                            title="Revenue"
                            value={money(data.revenue.value)}
                            change={data.revenue.change_percent}
                            icon={Banknote}
                        />
                        <MetricCard
                            title="Orders"
                            value={number(data.orders.value)}
                            change={data.orders.change_percent}
                            icon={ShoppingBag}
                        />
                        <MetricCard
                            title="Average Order Value"
                            value={money(data.average_order_value.value)}
                            change={data.average_order_value.change_percent}
                            icon={Activity}
                        />
                        <MetricCard
                            title="Customers"
                            value={number(data.customers.value)}
                            change={data.customers.change_percent}
                            icon={Users}
                        />
                    </div>

                    {/* Customer and profitability insights */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-sm text-gray-500">
                                Repeat Customer Rate
                            </p>
                            <p className="mt-2 text-xl font-bold dark:text-white">
                                {data.repeat_customer_rate.value.toFixed(1)}%
                            </p>
                            <Change
                                value={data.repeat_customer_rate.change_percent}
                            />
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-sm text-gray-500">
                                Conversion Rate
                            </p>
                            <p className="mt-2 text-xl font-bold dark:text-white">
                                {data.conversion_rate ?
                                    `${data.conversion_rate.value.toFixed(2)}%`
                                    : 'Unavailable'}
                            </p>
                            {data.conversion_rate && (
                                <Change
                                    value={data.conversion_rate.change_percent}
                                />
                            )}
                            {!data.conversion_rate && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Requires website visit tracking
                                </p>
                            )}
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-sm text-gray-500">
                                Estimated Profit
                            </p>
                            <p className="mt-2 text-xl font-bold dark:text-white">
                                {data.estimated_profit ? money(data.estimated_profit.value) : "Unavailable"}
                            </p>
                            {data.estimated_profit ? (
                                <Change
                                    value={data.estimated_profit.change_percent}
                                />
                            ) : (
                                <p className="mt-1 text-xs text-gray-500">
                                    Requires product costs and expenses
                                </p>
                            )}
                        </div>
                        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
                            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                                <AlertTriangle size={18} />
                                <p className="text-sm">Low-Stock Products</p>
                            </div>
                            <p className="mt-2 text-xl font-bold text-orange-800 dark:text-orange-200">
                                {number(data.low_stock_count)}
                            </p>
                            <p className="mt-1 text-xs text-orange-700 dark:text-orange-300">
                                Products needing stock review
                            </p>
                        </div>
                    </div>
                    {/* Revenue and Order Trends */}
                    <Panel
                        title="Sales Performance"
                        description="Revenue and order volume during the selected period"
                    >
                        <div className="h-80">
                            {data.revenue_trend.length ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.revenue_trend}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />
                                        <XAxis dataKey="label" />
                                        <YAxis
                                            yAxisId="revenue"
                                            tickFormatter={(v: any) =>
                                                `KES ${Number(v).toLocaleString()}`
                                            }
                                            width={95}
                                        />
                                        <YAxis
                                            yAxisId="orders"
                                            orientation="right"
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                name === "Revenue"
                                                    ? money(Number(value))
                                                    : number(Number(value)),
                                                name,
                                            ]}
                                        />
                                        <Legend />
                                        <Line
                                            yAxisId="revenue"
                                            type="monotone"
                                            dataKey="revenue"
                                            name="Revenue"
                                            stroke="#4F46E5"
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                        <Line
                                            yAxisId="orders"
                                            type="monotone"
                                            dataKey="orders"
                                            name="Orders"
                                            stroke="#0891B2"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyState text="No sales trend data for this period." />
                            )}
                        </div>
                    </Panel>
                    {/* Category performance and order status */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <Panel
                            title="Category Performance"
                            description="Compare category revenue"
                        >
                            <div className="h-72">
                                {data.category_performance.length ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={data.category_performance}
                                            margin={{ left: 10, right: 15 }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 11 }}
                                            />
                                            <YAxis
                                                tickFormatter={(v: any) =>
                                                    `${Number(v).toLocaleString()}`
                                                }
                                            />
                                            <Tooltip
                                                formatter={(v: any) => money(Number(v))}
                                            />
                                            <Bar
                                                dataKey="revenue"
                                                name="Revenue"
                                                fill="#4F46E5"
                                                radius={[5, 5, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <EmptyState text="No category performance data." />
                                )}
                            </div>
                        </Panel>
                        <Panel
                            title="Order Status Distribution"
                            description="Understand your current order pipeline"
                        >
                            <div className="h-72">
                                {data.orders_by_status.length ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.orders_by_status}
                                                dataKey="count"
                                                nameKey="status"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={85}
                                                label={({ name, value }: any) =>
                                                    `${titleCase(String(name ?? ""))}: ${value}`
                                                }
                                            >
                                                {data.orders_by_status.map(
                                                    (item) => (
                                                        <Cell
                                                            key={item.status}
                                                            fill={
                                                                statusColors[
                                                                item.status.toLowerCase()
                                                                ] || "#9CA3AF"
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip />
                                            <Legend
                                                formatter={(value: any) =>
                                                    titleCase(String(value))
                                                }
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <EmptyState text="No order status data." />
                                )}
                            </div>
                        </Panel>
                    </div>
                    {/* Payment methods and funnel */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <Panel
                            title="Payment Method Analysis"
                            description="Successful payment amounts by method"
                        >
                            {data.payment_methods.length ? (
                                <div className="space-y-5">
                                    {data.payment_methods.map((item) => {
                                        const total = data.payment_methods.reduce(
                                            (sum, p) => sum + p.amount,
                                            0
                                        );
                                        const share = total > 0
                                            ? (item.amount / total) * 100
                                            : 0;

                                        return (
                                            <div key={item.method}>
                                                <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">
                                                    <span className="font-medium dark:text-white">
                                                        {titleCase(item.method)}
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {money(item.amount)} ({share.toFixed(1)}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                                    <div
                                                        className="h-full rounded-full bg-indigo-600"
                                                        style={{ width: `${share}%` }}
                                                    />
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {number(item.count)} payments
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <EmptyState text="No payment method data available." />
                            )}
                        </Panel>

                        <Panel
                            title="Store Conversion Funnel"
                            description="Measure how effectively visits turn into orders"
                        >
                            {data.funnel.visits !== null &&
                                data.funnel.visits > 0 ? (
                                <div className="space-y-5">
                                    <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-950">
                                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                            Website visits
                                        </p>
                                        <p className="mt-1 text-2xl font-bold dark:text-white">
                                            {number(data.funnel.visits)}
                                        </p>
                                    </div>

                                    <div className="flex justify-center text-gray-400">
                                        ↓
                                    </div>

                                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            Orders placed
                                        </p>
                                        <p className="mt-1 text-2xl font-bold dark:text-white">
                                            {number(data.funnel.orders)}
                                        </p>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Conversion rate:{" "}
                                        <strong>
                                            {(
                                                (data.funnel.orders /
                                                    data.funnel.visits) *
                                                100
                                            ).toFixed(2)}%
                                        </strong>
                                    </p>
                                </div>
                            ) : (
                                <EmptyState text="Connect website analytics or visit tracking to measure conversion." />
                            )}
                        </Panel>
                    </div>
                    {/* Top products */}
                    <Panel
                        title="Top-Selling Products"
                        description="Ranked by units sold in the selected period"
                    >
                        <div className="h-80">
                            {data.top_products.length ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data.top_products}
                                        layout="vertical"
                                        margin={{ left: 15, right: 25 }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            horizontal={false}
                                        />
                                        <XAxis type="number" allowDecimals={false} />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={125}
                                            tick={{ fontSize: 11 }}
                                        />
                                        <Tooltip
                                            formatter={(v, name) => [
                                                name === "Revenue"
                                                    ? money(Number(v))
                                                    : number(Number(v)),
                                                name,
                                            ]}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="units_sold"
                                            name="Units sold"
                                            fill="#0891B2"
                                            radius={[0, 4, 4, 0]}
                                        />
                                        <Bar
                                            dataKey="revenue"
                                            name="Revenue"
                                            fill="#4F46E5"
                                            radius={[0, 4, 4, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyState text="No product sales data available." />
                            )}
                        </div>
                    </Panel>
                    {/* Insights and stock warnings */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <Panel
                            title="Actionable Business Insights"
                            description="Observations generated from your store's data"
                        >
                            {data.insights.length ? (
                                <div className="space-y-3">
                                    {data.insights.map((item, index) => (
                                        <div
                                            key={`${item.title}-${index}`}
                                            className={`rounded-lg border p-4 ${item.severity === "warning"
                                                ? "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950"
                                                : item.severity === "success"
                                                    ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
                                                    : "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
                                                }`}
                                        >
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {item.title}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState text="No business insights have been generated yet." />
                            )}
                        </Panel>

                        <Panel
                            title="Inventory Alerts"
                            description="Products that may need restocking"
                        >
                            {data.low_stock_products.length ? (
                                <div className="space-y-3">
                                    {data.low_stock_products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 dark:border-gray-700"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="rounded-lg bg-orange-50 p-2 text-orange-600 dark:bg-orange-950 dark:text-orange-300">
                                                    <Boxes size={18} />
                                                </div>
                                                <p className="truncate text-sm font-medium dark:text-white">
                                                    {product.name}
                                                </p>
                                            </div>
                                            <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                                {product.stock} left
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState text="No low-stock products reported." />
                            )}
                        </Panel>
                    </div>

                    {/* Recent orders */}
                    <Panel
                        title="Recent Orders"
                        description="Latest transactions in your store"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-4 py-3">Order</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {data.recent_orders.map((order) => (
                                        <tr
                                            key={order.order_number}
                                            className="dark:text-gray-200"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3 font-medium">
                                                {order.order_number}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {order.customer_name}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {money(order.total_amount)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs dark:bg-gray-700">
                                                    {titleCase(order.status)}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {new Date(order.created_at).toLocaleDateString("en-KE")}
                                            </td>
                                        </tr>
                                    ))}
                                    {!data.recent_orders.length && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-8 text-center text-gray-500"
                                            >
                                                No recent orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Panel>
                </>
            ) : null}
        </main>
    );
}