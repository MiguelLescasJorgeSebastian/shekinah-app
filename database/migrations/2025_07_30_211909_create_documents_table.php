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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type'); // 'song_list', 'ministry_guide', 'procedure', 'other'
            $table->string('file_path'); // ruta del archivo
            $table->string('original_filename');
            $table->string('mime_type');
            $table->bigInteger('file_size');
            $table->json('metadata')->nullable(); // información adicional específica del tipo
            $table->foreignId('ministry_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('uploaded_by')->constrained('users');
            $table->json('access_permissions')->nullable(); // control de acceso por roles/ministerios
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
