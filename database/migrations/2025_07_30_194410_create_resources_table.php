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
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['document', 'song_list', 'schedule', 'checklist', 'other']);
            $table->text('content')->nullable(); // Para listas de canciones, contenido de texto
            $table->string('file_path')->nullable(); // Para documentos subidos
            $table->json('shared_with_ministries')->nullable(); // IDs de ministerios con acceso
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('ministry_id')->constrained()->onDelete('cascade'); // Ministerio propietario
            $table->boolean('is_public')->default(false); // Si es accesible para todos
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};
