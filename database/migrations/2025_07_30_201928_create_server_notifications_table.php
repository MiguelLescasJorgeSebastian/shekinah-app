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
        Schema::create('server_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('server_id')->constrained()->onDelete('cascade');
            $table->foreignId('schedule_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('event_id')->nullable()->constrained()->onDelete('cascade');

            $table->string('type'); // assignment, reminder, change, cancellation
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable(); // Datos adicionales en formato JSON

            $table->string('delivery_method'); // email, sms, both
            $table->string('status')->default('pending'); // pending, sent, delivered, failed, read

            $table->timestamp('scheduled_for')->nullable(); // Cuándo enviar
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();

            // Para tracking de respuestas
            $table->string('response_token')->nullable()->unique();
            $table->string('response_status')->nullable(); // confirmed, declined, maybe
            $table->text('response_message')->nullable();
            $table->timestamp('responded_at')->nullable();

            $table->timestamps();

            $table->index(['server_id', 'status']);
            $table->index(['scheduled_for']);
            $table->index(['response_token']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('server_notifications');
    }
};
