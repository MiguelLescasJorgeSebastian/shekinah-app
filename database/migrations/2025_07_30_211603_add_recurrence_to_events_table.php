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
        Schema::table('events', function (Blueprint $table) {
            $table->boolean('is_recurring')->default(false);
            $table->string('recurrence_type')->nullable(); // 'daily', 'weekly', 'biweekly', 'monthly'
            $table->json('recurrence_config')->nullable(); // días específicos, intervalo, etc.
            $table->date('recurrence_end_date')->nullable();
            $table->unsignedBigInteger('parent_event_id')->nullable(); // para instancias generadas
            $table->foreign('parent_event_id')->references('id')->on('events')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['parent_event_id']);
            $table->dropColumn([
                'is_recurring',
                'recurrence_type',
                'recurrence_config',
                'recurrence_end_date',
                'parent_event_id'
            ]);
        });
    }
};
