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
        Schema::create('ab_shoppingcart_item', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('ab_shoppingcart_id')->constrained('ab_shoppingcart', 'id')->onDelete('cascade');
            $table->foreignId('ab_article_id')->unique()->constrained('ab_article', 'id');
            $table->timestamp('ab_createdate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ab_shoppingcart_item');
    }
};
