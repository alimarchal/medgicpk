import { Head, useForm } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/PublicOrderController';
import AppLogoIcon from '@/components/app-logo-icon';
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
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    product: {
        name: string;
        subtitle: string;
        ingredients: string[];
        whatsappNumber: string;
        deliveryPrice: number;
    };
};

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
        <Label htmlFor={htmlFor}>
            {children}
            <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>
        </Label>
    );
}

export default function OrderHome({ product }: Props) {
    const { data, setData, processing, errors, submit } = useForm({
        name: '',
        phone_number: '',
        delivery_address: '',
        city: '',
        quantity: 1,
        website: '',
    });

    const totalAmount = data.quantity * product.deliveryPrice;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        submit('post', store().url);
    }

    return (
        <>
            <Head title="Order Now" />

            <div
                className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-5 md:px-10"
                style={{
                    backgroundImage: 'url(/images/background.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/35" />

                <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
                    <Card className="rounded-xl border-white/40 bg-white shadow-2xl">
                        <CardHeader className="px-10 pt-0 pb-0 text-center">
                            <div className="mx-auto inline-flex items-center justify-center rounded-2xl bg-white p-3">
                                <AppLogoIcon className="h-24 w-auto object-contain" />
                            </div>

                            <CardTitle className="text-2xl leading-tight md:text-[2rem]">
                                {product.name}
                            </CardTitle>
                            <CardDescription className="space-y-3 text-center">
                                <span className="block text-base font-medium text-foreground">
                                    {product.subtitle}
                                </span>
                            </CardDescription>
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                                {product.ingredients.map((ingredient) => (
                                    <Badge
                                        key={ingredient}
                                        variant="secondary"
                                        className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-950"
                                    >
                                        {ingredient}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>

                        <CardContent className="px-10 py-2">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    className="absolute -left-2499.75 top-auto h-px w-px opacity-0"
                                    aria-hidden="true"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                />

                                <div className="grid gap-2">
                                    <RequiredLabel htmlFor="name">Name</RequiredLabel>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Your full name"
                                        required
                                        autoComplete="name"
                                        autoFocus
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        aria-invalid={!!errors.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <RequiredLabel htmlFor="phone_number">Phone no</RequiredLabel>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        type="tel"
                                        placeholder="03XXXXXXXXX"
                                        required
                                        autoComplete="tel"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        aria-invalid={!!errors.phone_number}
                                    />
                                    <InputError message={errors.phone_number} />
                                </div>

                                <div className="grid gap-2">
                                    <RequiredLabel htmlFor="city">City</RequiredLabel>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="e.g. Lahore, Karachi, Islamabad"
                                        required
                                        autoComplete="address-level2"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        aria-invalid={!!errors.city}
                                    />
                                    <InputError message={errors.city} />
                                </div>

                                <div className="grid gap-2">
                                    <RequiredLabel htmlFor="delivery_address">Delivery address</RequiredLabel>
                                    <Textarea
                                        id="delivery_address"
                                        name="delivery_address"
                                        placeholder="House no, street, area"
                                        required
                                        value={data.delivery_address}
                                        onChange={(e) => setData('delivery_address', e.target.value)}
                                        aria-invalid={!!errors.delivery_address}
                                    />
                                    <InputError message={errors.delivery_address} />
                                </div>

                                <div className="grid gap-2">
                                    <RequiredLabel htmlFor="quantity">Quantity</RequiredLabel>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        min={1}
                                        max={20}
                                        required
                                        value={data.quantity}
                                        onChange={(e) =>
                                            setData('quantity', Math.max(1, parseInt(e.target.value) || 1))
                                        }
                                        aria-invalid={!!errors.quantity}
                                    />
                                    <InputError message={errors.quantity} />
                                </div>

                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                                    <div className="flex items-center justify-between text-sm text-emerald-800">
                                        <span>
                                            Rs. {product.deliveryPrice} × {data.quantity}{' '}
                                            {data.quantity === 1 ? 'bottle' : 'bottles'}
                                        </span>
                                        <span className="text-base font-bold">
                                            Rs. {totalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-center text-xs text-emerald-700">
                                        Inclusive of all delivery charges
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 h-11 w-full text-base"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Place Order
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
