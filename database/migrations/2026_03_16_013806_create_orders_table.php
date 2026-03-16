<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone_number', 20);
            $table->text('delivery_address');
            $table->unsignedInteger('quantity');
            $table->string('product_name')->default('OrgaDent Herbal Dental Powder');
            $table->string('status')->default('pending')->index();
            $table->boolean('is_spam')->default(false)->index();
            $table->text('whatsapp_message');
            $table->text('whatsapp_url');
            $table->string('submitted_ip', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
