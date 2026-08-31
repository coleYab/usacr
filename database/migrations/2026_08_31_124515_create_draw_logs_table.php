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
        Schema::create('draw_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lottery_id')->constrained()->cascadeOnDelete();
            $table->foreignId('winning_ticket_id')->constrained('tickets')->cascadeOnDelete();
            $table->unsignedInteger('total_participants');
            $table->unsignedInteger('total_tickets');
            $table->string('verification_seed');
            $table->string('verification_hash');
            $table->timestamp('processed_at');
            $table->timestamps();

            $table->index('processed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('draw_logs');
    }
};
