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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['service', 'meeting', 'special', 'training', 'outreach']);
            $table->datetime('start_datetime');
            $table->datetime('end_datetime');
            $table->string('location')->nullable();
            $table->json('required_ministries')->nullable(); // IDs de ministerios requeridos
            $table->enum('status', ['planned', 'confirmed', 'cancelled', 'completed'])->default('planned');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
