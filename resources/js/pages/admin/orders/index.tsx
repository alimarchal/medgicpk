import { Head, Link } from '@inertiajs/react';
import { Eye, MessageCircle, ShieldAlert } from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';
import { index as orders, show } from '@/routes/admin/orders';
import type { BreadcrumbItem } from '@/types';

type OrderRow = {
    id: number;
    name: string;
    phone_number: string;
    delivery_address: string;
    quantity: number;
    product_name: string;
    status: string;
    is_spam: boolean;
    whatsapp_url: string;
    created_at: string | null;
};

type Props = {
    orders: OrderRow[];
    stats: {
        total: number;
        pending: number;
        spam: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: orders(),
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

export default function OrdersIndex({ orders: rows, stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Orders"
                    description="Public order submissions ko review, verify, aur manage karein."
                />

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardDescription>Total orders</CardDescription>
                            <CardTitle className="text-3xl">{stats.total}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Pending</CardDescription>
                            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Marked as spam</CardDescription>
                            <CardTitle className="text-3xl">{stats.spam}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Latest submissions</CardTitle>
                        <CardDescription>
                            Har order ka status, quantity, aur WhatsApp shortcut yahan available hai.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b text-muted-foreground">
                                <tr>
                                    <th className="px-3 py-3 font-medium">Customer</th>
                                    <th className="px-3 py-3 font-medium">Quantity</th>
                                    <th className="px-3 py-3 font-medium">Status</th>
                                    <th className="px-3 py-3 font-medium">Address</th>
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
                                        <td className="px-3 py-4 font-medium">{order.quantity}</td>
                                        <td className="px-3 py-4">
                                            <Badge variant={statusVariant(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="max-w-xs px-3 py-4 text-muted-foreground">
                                            {order.delivery_address}
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
