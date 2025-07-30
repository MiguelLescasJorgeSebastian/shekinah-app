<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Ministry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->can('view documents')) {
            abort(403);
        }

        $query = Document::with(['ministry', 'uploader'])
                         ->where('is_active', true);

        // Filtrar por tipo si se especifica
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filtrar por ministerio si se especifica
        if ($request->filled('ministry_id')) {
            $query->where('ministry_id', $request->ministry_id);
        }

        // Filtrar por búsqueda
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $documents = $query->orderBy('created_at', 'desc')->paginate(12);

        // Filtrar documentos basado en permisos de acceso
        $documents->getCollection()->transform(function ($document) use ($user) {
            if (!$document->userHasAccess($user)) {
                return null;
            }
            return $document;
        })->filter();

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'ministries' => Ministry::all(),
            'types' => Document::getTypes(),
            'filters' => $request->only(['type', 'ministry_id', 'search']),
            'canCreate' => $user->can('create documents'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        if (!$request->user()->can('create documents')) {
            abort(403);
        }

        return Inertia::render('Documents/Create', [
            'ministries' => Ministry::all(),
            'types' => Document::getTypes(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!$request->user()->can('create documents')) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:' . implode(',', array_keys(Document::getTypes())),
            'ministry_id' => 'nullable|exists:ministries,id',
            'file' => 'required|file|max:10240', // 10MB max
            'access_permissions' => 'nullable|array',
            'metadata' => 'nullable|array',
        ]);

        // Subir archivo
        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('documents', $filename, 'private');

        $document = Document::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'file_path' => $path,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'metadata' => $validated['metadata'] ?? null,
            'ministry_id' => $validated['ministry_id'] ?? null,
            'uploaded_by' => $request->user()->id,
            'access_permissions' => $validated['access_permissions'] ?? null,
        ]);

        return redirect()->route('documents.index')
                        ->with('success', 'Documento subido exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Document $document)
    {
        if (!$request->user()->can('view documents') || !$document->userHasAccess($request->user())) {
            abort(403);
        }

        $document->load(['ministry', 'uploader']);

        return Inertia::render('Documents/Show', [
            'document' => $document,
            'canEdit' => $request->user()->can('edit documents') &&
                        ($document->uploaded_by === $request->user()->id ||
                         $request->user()->hasAnyRole(['Pastor', 'Líder de Iglesia'])),
        ]);
    }

    /**
     * Download the specified resource.
     */
    public function download(Request $request, Document $document)
    {
        if (!$request->user()->can('view documents') || !$document->userHasAccess($request->user())) {
            abort(403);
        }

        if (!Storage::disk('private')->exists($document->file_path)) {
            abort(404, 'Archivo no encontrado');
        }

        return response()->download(
            Storage::disk('private')->path($document->file_path),
            $document->original_filename
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Document $document)
    {
        if (!$request->user()->can('edit documents') ||
            ($document->uploaded_by !== $request->user()->id &&
             !$request->user()->hasAnyRole(['Pastor', 'Líder de Iglesia']))) {
            abort(403);
        }

        return Inertia::render('Documents/Edit', [
            'document' => $document,
            'ministries' => Ministry::all(),
            'types' => Document::getTypes(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        if (!$request->user()->can('edit documents') ||
            ($document->uploaded_by !== $request->user()->id &&
             !$request->user()->hasAnyRole(['Pastor', 'Líder de Iglesia']))) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:' . implode(',', array_keys(Document::getTypes())),
            'ministry_id' => 'nullable|exists:ministries,id',
            'access_permissions' => 'nullable|array',
            'metadata' => 'nullable|array',
        ]);

        $document->update($validated);

        return redirect()->route('documents.index')
                        ->with('success', 'Documento actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Document $document)
    {
        if (!$request->user()->can('delete documents') ||
            ($document->uploaded_by !== $request->user()->id &&
             !$request->user()->hasAnyRole(['Pastor', 'Líder de Iglesia']))) {
            abort(403);
        }

        // Eliminar archivo físico
        if (Storage::disk('private')->exists($document->file_path)) {
            Storage::disk('private')->delete($document->file_path);
        }

        $document->delete();

        return redirect()->route('documents.index')
                        ->with('success', 'Documento eliminado exitosamente.');
    }
}
