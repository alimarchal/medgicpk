<?php

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public const PRODUCT_NAME = 'OrgaDent Herbal Dental Powder';

    public const STATUSES = [
        'pending',
        'confirmed',
        'dispatched',
        'delivered',
        'cancelled',
    ];

    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'phone_number',
        'delivery_address',
        'city',
        'quantity',
        'product_name',
        'status',
        'is_spam',
        'whatsapp_message',
        'whatsapp_url',
        'submitted_ip',
        'user_agent',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_spam' => 'boolean',
        ];
    }
}
