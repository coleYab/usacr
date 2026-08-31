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
        Schema::create('lotteries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->json('media')->nullable();
            $table->decimal('ticket_price', 10, 2);
            $table->unsignedInteger('total_tickets');
            $table->unsignedInteger('tickets_sold')->default(0);
            $table->timestamp('draw_at');
            $table->enum('status', ['draft', 'active', 'completed', 'cancelled'])->default('draft');
            $table->unsignedBigInteger('winning_ticket_id')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['status', 'draw_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lotteries');
    }
};
