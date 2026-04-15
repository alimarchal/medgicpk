<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PublicOrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('orders/home', [
            'product' => [
                'name' => Order::PRODUCT_NAME,
                'subtitle' => 'Natural Teeth Cleaning Powder',
                'ingredients' => ['Neem', 'Clove', 'Mint'],
                'whatsappNumber' => config('order.whatsapp_number'),
                'deliveryPrice' => config('order.delivery_price'),
            ],
        ]);
    }

    public function store(StoreOrderRequest $request): HttpResponse
    {
        $validated = $request->validated();
        $deliveryPrice = config('order.delivery_price');
        $whatsappNumber = config('order.whatsapp_number');

        $message = $this->buildWhatsappMessage($validated, $deliveryPrice);
        $whatsappUrl = 'https://wa.me/'.$whatsappNumber.'?text='.rawurlencode($message);

        Order::query()->create([
            'name' => $validated['name'],
            'phone_number' => $validated['phone_number'],
            'delivery_address' => $validated['delivery_address'],
            'city' => $validated['city'],
            'quantity' => $validated['quantity'],
            'product_name' => Order::PRODUCT_NAME,
            'status' => 'pending',
            'is_spam' => false,
            'whatsapp_message' => $message,
            'whatsapp_url' => $whatsappUrl,
            'submitted_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return Inertia::location($whatsappUrl);
    }

    /**
     * Build the outbound WhatsApp message.
     *
     * @param  array{name: string, phone_number: string, delivery_address: string, city: string, quantity: int}  $validated
     */
    private function buildWhatsappMessage(array $validated, int $deliveryPrice): string
    {
        $totalAmount = $validated['quantity'] * $deliveryPrice;

        return collect([
            'Assalam o Alaikum, mujhe OrgaDent Herbal Dental Powder order karna hai.',
            '',
            'Product: '.Order::PRODUCT_NAME,
            'Name: '.$validated['name'],
            'Phone: '.$validated['phone_number'],
            'City: '.$validated['city'],
            'Delivery Address: '.$validated['delivery_address'],
            'Quantity: '.$validated['quantity'],
            '',
            'Price per bottle: Rs. '.$deliveryPrice.' (inclusive of all delivery charges)',
            'Total Amount: Rs. '.$totalAmount,
        ])->implode("\n");
    }
}
