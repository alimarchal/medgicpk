import { Form, Head, Link } from '@inertiajs/react';
import PublicOrderController from '@/actions/App/Http/Controllers/PublicOrderController';
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
import { login } from '@/routes';

type Props = {
    product: {
        name: string;
        subtitle: string;
        ingredients: string[];
        whatsappNumber: string;
    };
};

export default function OrderHome({ product }: Props) {
    return (
        <>
            <Head title="Order Now" />

            <div
                className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-10 md:px-10"
                style={{
                    backgroundImage: 'url(/images/background.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/35" />

                <div className="relative z-10 w-full max-w-6xl">
                    <div className="mb-5 flex justify-end">
                        <Link
                            href={login()}
                            className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
                        >
                            Admin Login
                        </Link>
                    </div>

                    <Card className="overflow-hidden border-white/40 bg-white/92 shadow-2xl backdrop-blur md:bg-white/95">
                        <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
                            <div className="bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(17,24,39,0.88))] px-7 py-8 text-white md:px-10 md:py-10">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-2xl bg-white/95 p-3 shadow-lg">
                                        <AppLogoIcon className="h-16 w-auto object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold tracking-[0.35em] text-emerald-200 uppercase">
                                            LOGO
                                        </p>
                                        <h1 className="mt-2 text-2xl font-semibold md:text-4xl">
                                            {product.name}
                                        </h1>
                                    </div>
                                </div>

                                <p className="mt-8 max-w-xl text-lg font-medium text-white/90 md:text-2xl">
                                    {product.subtitle}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-3">
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

                                <div className="mt-10 space-y-4 text-sm text-white/80 md:text-base">
                                    <p>
                                        Herbal cleaning formula jo aapke daily oral care routine ko natural support deti hai.
                                    </p>
                                    <p>
                                        Form submit karte hi aapka order save hoga aur WhatsApp chat prefilled message ke saath open ho jayegi.
                                    </p>
                                    <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur">
                                        <p className="text-xs font-semibold tracking-[0.3em] text-emerald-200 uppercase">
                                            WhatsApp Order Line
                                        </p>
                                        <p className="mt-2 text-xl font-semibold text-white">
                                            +{product.whatsappNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-7 md:px-8 md:py-8">
                                <CardHeader className="px-0 pt-0">
                                    <CardTitle className="text-2xl">Place your order</CardTitle>
                                    <CardDescription>
                                        Apni details fill karein. Order save hone ke baad WhatsApp automatically open ho jayega.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="px-0 pb-0">
                                    <Form
                                        {...PublicOrderController.store.form()}
                                        className="space-y-5"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <input
                                                    type="text"
                                                    name="website"
                                                    tabIndex={-1}
                                                    autoComplete="off"
                                                    className="absolute -left-[9999px] top-auto h-px w-px opacity-0"
                                                    aria-hidden="true"
                                                />

                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        placeholder="Your full name"
                                                        required
                                                        autoComplete="name"
                                                        autoFocus
                                                    />
                                                    <InputError message={errors.name} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="phone_number">Phone no</Label>
                                                    <Input
                                                        id="phone_number"
                                                        name="phone_number"
                                                        type="tel"
                                                        placeholder="03XXXXXXXXX"
                                                        required
                                                        autoComplete="tel"
                                                    />
                                                    <InputError message={errors.phone_number} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="delivery_address">Delivery address</Label>
                                                    <Textarea
                                                        id="delivery_address"
                                                        name="delivery_address"
                                                        placeholder="House no, street, area, city"
                                                        required
                                                    />
                                                    <InputError message={errors.delivery_address} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="quantity">Quantity</Label>
                                                    <Input
                                                        id="quantity"
                                                        name="quantity"
                                                        type="number"
                                                        min={1}
                                                        max={20}
                                                        defaultValue={1}
                                                        required
                                                    />
                                                    <InputError message={errors.quantity} />
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="h-11 w-full rounded-xl text-base"
                                                    disabled={processing}
                                                >
                                                    {processing && <Spinner />}
                                                    Place Order on WhatsApp
                                                </Button>
                                            </>
                                        )}
                                    </Form>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
