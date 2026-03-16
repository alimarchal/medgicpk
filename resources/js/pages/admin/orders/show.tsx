import { Transition } from '@headlessui/react';
import { Form, Head, Link } from '@inertiajs/react';
import AdminOrderController from '@/actions/App/Http/Controllers/Admin/OrderController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { index as orders, show } from '@/routes/admin/orders';
import type { BreadcrumbItem } from '@/types';

type OrderDetail = {
    id: number;
    name: string;
    phone_number: string;
    delivery_address: string;
    quantity: number;
    product_name: string;
    status: string;
    is_spam: boolean;
    whatsapp_message: string;
    whatsapp_url: string;
    submitted_ip: string | null;
    user_agent: string | null;
    created_at: string | null;
    updated_at: string | null;
};

type Props = {
    order: OrderDetail;
    statuses: string[];
};

export default function OrderShow({ order, statuses }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Orders',
            href: orders(),
        },
        {
            title: `Order #${order.id}`,
            href: show(order.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id}`} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title={`Order #${order.id}`}
                    description="Customer details, status, spam flag, aur WhatsApp payload ko yahan manage karein."
                />

                <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit order</CardTitle>
                            <CardDescription>
                                Customer information aur delivery workflow yahin se update karein.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...AdminOrderController.update.form(order.id)}
                                options={{ preserveScroll: true }}
                                className="space-y-5"
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <>
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input id="name" name="name" defaultValue={order.name} required />
                                                <InputError message={errors.name} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone_number">Phone no</Label>
                                                <Input
                                                    id="phone_number"
                                                    name="phone_number"
                                                    type="tel"
                                                    defaultValue={order.phone_number}
                                                    required
                                                />
                                                <InputError message={errors.phone_number} />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="delivery_address">Delivery address</Label>
                                            <Textarea
                                                id="delivery_address"
                                                name="delivery_address"
                                                defaultValue={order.delivery_address}
                                                required
                                            />
                                            <InputError message={errors.delivery_address} />
                                        </div>

                                        <div className="grid gap-5 md:grid-cols-3">
                                            <div className="grid gap-2">
                                                <Label htmlFor="quantity">Quantity</Label>
                                                <Input
                                                    id="quantity"
                                                    name="quantity"
                                                    type="number"
                                                    min={1}
                                                    max={20}
                                                    defaultValue={order.quantity}
                                                    required
                                                />
                                                <InputError message={errors.quantity} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="status">Status</Label>
                                                <select
                                                    id="status"
                                                    name="status"
                                                    defaultValue={order.status}
                                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                                >
                                                    {statuses.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.status} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="is_spam">Spam status</Label>
                                                <select
                                                    id="is_spam"
                                                    name="is_spam"
                                                    defaultValue={order.is_spam ? '1' : '0'}
                                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                                >
                                                    <option value="0">Legit</option>
                                                    <option value="1">Spam</option>
                                                </select>
                                                <InputError message={errors.is_spam} />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <Button disabled={processing}>Save changes</Button>
                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-muted-foreground">Saved</p>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Product</p>
                                    <p className="font-medium">{order.product_name}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Current status</p>
                                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                        {order.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Created at</p>
                                    <p className="font-medium">{order.created_at ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Updated at</p>
                                    <p className="font-medium">{order.updated_at ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Submitted IP</p>
                                    <p className="font-medium">{order.submitted_ip ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">User agent</p>
                                    <p className="wrap-break-word font-medium">{order.user_agent ?? 'N/A'}</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button asChild variant="secondary">
                                        <a href={order.whatsapp_url} target="_blank" rel="noreferrer">
                                            Open WhatsApp
                                        </a>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href={orders()}>Back to orders</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Saved message</CardTitle>
                                <CardDescription>
                                    Yeh wahi message hai jo public order submit par WhatsApp mein prefill hota hai.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-sm whitespace-pre-wrap">
                                    {order.whatsapp_message}
                                </pre>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Danger zone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...AdminOrderController.destroy.form(order.id)}>
                                    {({ processing }) => (
                                        <Button variant="destructive" disabled={processing}>
                                            Delete order
                                        </Button>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
