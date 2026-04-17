import { Head, Link, router } from '@inertiajs/react';
import { Eye, Filter, MessageCircle, Search, ShieldAlert, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { index as ordersRoute, show } from '@/routes/admin/orders';
import type { BreadcrumbItem } from '@/types';

type OrderRow = {
    id: number;
    name: string;
    phone_number: string;
    delivery_address: string;
    city: string | null;
    quantity: number;
    product_name: string;
    status: string;
    is_spam: boolean;
    whatsapp_url: string;
    created_at: string | null;
};

type Filters = {
    status?: string;
    is_spam?: string;
    city?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
};

type Props = {
    orders: OrderRow[];
    stats: {
        total: number;
        pending: number;
        confirmed: number;
        dispatched: number;
        delivered: number;
        cancelled: number;
        spam: number;
    };
    filters: Filters;
    statuses: string[];
    cities: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: ordersRoute(),
    },
];

function statusVariant(status: string): 'default' | 'secondary' | 'outline' {
    if (status === 'delivered') {
        return 'default';
    }

    if (status === 'cancelled') {
        return 'outline';
    }

    return 'secondary';
}

const INACTIVITY_MS = 10_000;
const MOUSE_LEAVE_MS = 5_000;

export default function OrdersIndex({ orders: rows, stats, filters, statuses, cities }: Props) {
    const [localFilters, setLocalFilters] = useState<Filters>(filters);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [filtersOpacity, setFiltersOpacity] = useState(1);

    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mouseLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const filterPanelRef = useRef<HTMLDivElement>(null);

    const clearTimers = () => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
        }
        if (mouseLeaveTimer.current) {
            clearTimeout(mouseLeaveTimer.current);
        }
    };

    const startInactivityTimer = useCallback(() => {
        clearTimers();
        inactivityTimer.current = setTimeout(() => {
            setFiltersOpacity(0);
            setTimeout(() => setFiltersVisible(false), 300);
        }, INACTIVITY_MS);
    }, []);

    const handleFilterPanelMouseEnter = () => {
        clearTimers();
        setFiltersOpacity(1);
    };

    const handleFilterPanelMouseLeave = () => {
        mouseLeaveTimer.current = setTimeout(() => {
            setFiltersOpacity(0);
            setTimeout(() => setFiltersVisible(false), 300);
        }, MOUSE_LEAVE_MS);
    };

    const handleFilterInteraction = () => {
        setFiltersOpacity(1);
        startInactivityTimer();
    };

    const openFilters = () => {
        if (filtersVisible) {
            clearTimers();
            setFiltersOpacity(0);
            setTimeout(() => setFiltersVisible(false), 300);
        } else {
            setFiltersVisible(true);
            setFiltersOpacity(1);
            startInactivityTimer();
        }
    };

    useEffect(() => {
        return () => clearTimers();
    }, []);

    const applyFilters = useCallback((newFilters: Filters) => {
        const cleaned = Object.fromEntries(
            Object.entries(newFilters).filter(([, v]) => v !== '' && v !== undefined),
        );
        router.get(ordersRoute(), cleaned as Record<string, string>, { preserveScroll: true, replace: true });
    }, []);

    const handleChange = (key: keyof Filters, value: string) => {
        const updated = { ...localFilters, [key]: value };
        setLocalFilters(updated);
        handleFilterInteraction();
    };

    const handleSearch = () => {
        applyFilters(localFilters);
        clearTimers();
        setFiltersOpacity(0);
        setTimeout(() => setFiltersVisible(false), 300);
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get(ordersRoute(), {}, { preserveScroll: true, replace: true });
        clearTimers();
        setFiltersOpacity(0);
        setTimeout(() => setFiltersVisible(false), 300);
    };

    const hasActiveFilters = Object.values(localFilters).some((v) => v !== '' && v !== undefined);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title="Orders"
                        description="Public order submissions ko review, verify, aur manage karein."
                    />
                    <div className="flex shrink-0 items-center gap-2 pt-1">
                        {hasActiveFilters && (
                            <Button onClick={clearFilters} variant="ghost" size="sm">
                                <X className="size-4" />
                                Clear filters
                            </Button>
                        )}
                        <Button
                            onClick={openFilters}
                            variant={hasActiveFilters ? 'default' : 'outline'}
                            size="sm"
                        >
                            <Filter className="size-4" />
                            Filters
                            {hasActiveFilters && (
                                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                                    {Object.values(localFilters).filter((v) => v !== '' && v !== undefined).length}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total</CardDescription>
                            <CardTitle className="text-3xl">{stats.total}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Pending</CardDescription>
                            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Confirmed</CardDescription>
                            <CardTitle className="text-3xl">{stats.confirmed}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Dispatched</CardDescription>
                            <CardTitle className="text-3xl">{stats.dispatched}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Delivered</CardDescription>
                            <CardTitle className="text-3xl">{stats.delivered}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Cancelled</CardDescription>
                            <CardTitle className="text-3xl">{stats.cancelled}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Spam</CardDescription>
                            <CardTitle className="text-3xl">{stats.spam}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Filters panel — hidden by default, toggled via Filter button */}
                {filtersVisible && (
                    <div
                        ref={filterPanelRef}
                        style={{
                            opacity: filtersOpacity,
                            transition: 'opacity 300ms ease',
                        }}
                        onMouseEnter={handleFilterPanelMouseEnter}
                        onMouseLeave={handleFilterPanelMouseLeave}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Filters</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                                    <div className="flex flex-col gap-1.5">
                                        <Label>Search</Label>
                                        <div className="relative">
                                            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                                            <Input
                                                className="h-9 pl-8"
                                                placeholder="Name / phone..."
                                                value={localFilters.search ?? ''}
                                                onChange={(e) => handleChange('search', e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label>Status</Label>
                                        <Select
                                            value={localFilters.status ?? ''}
                                            onValueChange={(v) => handleChange('status', v === 'all' ? '' : v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All statuses</SelectItem>
                                                {statuses.map((s) => (
                                                    <SelectItem key={s} value={s}>
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label>City</Label>
                                        <Select
                                            value={localFilters.city ?? ''}
                                            onValueChange={(v) => handleChange('city', v === 'all' ? '' : v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All cities" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All cities</SelectItem>
                                                {cities.map((c) => (
                                                    <SelectItem key={c} value={c}>
                                                        {c}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label>Spam</Label>
                                        <Select
                                            value={localFilters.is_spam ?? ''}
                                            onValueChange={(v) => handleChange('is_spam', v === 'all' ? '' : v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="1">Spam only</SelectItem>
                                                <SelectItem value="0">Not spam</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label>Date from</Label>
                                        <Input
                                            className="h-9"
                                            type="date"
                                            value={localFilters.date_from ?? ''}
                                            onChange={(e) => handleChange('date_from', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label>Date to</Label>
                                        <Input
                                            className="h-9"
                                            type="date"
                                            value={localFilters.date_to ?? ''}
                                            onChange={(e) => handleChange('date_to', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button onClick={handleSearch} size="sm">
                                        <Search className="size-4" />
                                        Apply
                                    </Button>
                                    {hasActiveFilters && (
                                        <Button onClick={clearFilters} variant="outline" size="sm">
                                            <X className="size-4" />
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Orders{' '}
                            <span className="text-muted-foreground font-normal text-base">
                                ({rows.length})
                            </span>
                        </CardTitle>
                        <CardDescription>
                            Latest orders pehle. Har order ka status, city, quantity, aur WhatsApp shortcut yahan available hai.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        {rows.length === 0 ? (
                            <p className="py-8 text-center text-muted-foreground text-sm">No orders found.</p>
                        ) : (
                            <table className="min-w-full text-left text-sm">
                                <thead className="border-b text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-3 font-medium">Customer</th>
                                        <th className="px-3 py-3 font-medium">City</th>
                                        <th className="px-3 py-3 font-medium">Qty</th>
                                        <th className="px-3 py-3 font-medium">Status</th>
                                        <th className="px-3 py-3 font-medium">Address</th>
                                        <th className="px-3 py-3 font-medium">Date</th>
                                        <th className="px-3 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((order) => (
                                        <tr key={order.id} className="border-b align-top last:border-b-0">
                                            <td className="px-3 py-4">
                                                <div className="font-medium">{order.name}</div>
                                                <div className="text-muted-foreground">{order.phone_number}</div>
                                                {order.is_spam && (
                                                    <div className="mt-2">
                                                        <Badge variant="destructive" className="gap-1">
                                                            <ShieldAlert className="size-3.5" />
                                                            Spam
                                                        </Badge>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-3 py-4 text-muted-foreground">
                                                {order.city ?? '—'}
                                            </td>
                                            <td className="px-3 py-4 font-medium">{order.quantity}</td>
                                            <td className="px-3 py-4">
                                                <Badge variant={statusVariant(order.status)}>
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="max-w-xs px-3 py-4 text-muted-foreground">
                                                {order.delivery_address}
                                            </td>
                                            <td className="px-3 py-4 text-muted-foreground whitespace-nowrap">
                                                {order.created_at
                                                    ? new Date(order.created_at).toLocaleDateString('en-PK', {
                                                          day: '2-digit',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      })
                                                    : '—'}
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={show(order.id)}>
                                                            <Eye className="size-4" />
                                                            Manage
                                                        </Link>
                                                    </Button>
                                                    <Button asChild variant="secondary" size="sm">
                                                        <a href={order.whatsapp_url} target="_blank" rel="noreferrer">
                                                            <MessageCircle className="size-4" />
                                                            WhatsApp
                                                        </a>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
