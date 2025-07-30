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
        Schema::table('servers', function (Blueprint $table) {
            // Permitir que user_id sea nullable para servidores externos
            $table->unsignedBigInteger('user_id')->nullable()->change();

            // Campos para servidores externos
            $table->string('external_name')->nullable();
            $table->string('external_email')->nullable();
            $table->string('external_phone')->nullable();
            $table->boolean('is_external')->default(false);

            // Campos para notificaciones
            $table->boolean('email_notifications')->default(true);
            $table->boolean('sms_notifications')->default(false);
            $table->string('preferred_contact_method')->default('email'); // email, sms, both

            // Token único para enlaces de confirmación
            $table->string('notification_token')->nullable()->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('servers', function (Blueprint $table) {
            $table->dropColumn([
                'external_name',
                'external_email',
                'external_phone',
                'is_external',
                'email_notifications',
                'sms_notifications',
                'preferred_contact_method',
                'notification_token'
            ]);

            // Revertir user_id a required
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });
    }
};
