import { Form, Head } from '@inertiajs/react';
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
                                {/* <span className="block">
                                    Apni details fill karein. Order save hone ke baad WhatsApp automatically open ho jayega.
                                </span> */}
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
                            <Form
                                {...PublicOrderController.store.form()}
                                className="flex flex-col gap-5"
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
                                            className="mt-2 h-11 w-full text-base"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner />}
                                            Place Order
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
