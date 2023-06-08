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
        Schema::create('ab_article', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('ab_name', 80)->unique();
            $table->integer('ab_price');
            $table->string('ab_description', 1000);
            $table->foreignId('ab_creator_id')->constrained('ab_user');
            $table->timestamp('ab_createdate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ab_article');
    }
};
