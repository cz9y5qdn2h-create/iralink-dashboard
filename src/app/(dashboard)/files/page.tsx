"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, Upload, Brain, Clock, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface AnalysisResult {
  processes: string[];
  automations: string[];
  inefficiencies: string[];
  summary: string;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  storage_path: string;
  analysis_status: "pending" | "processing" | "done" | "error";
  analysis_result: AnalysisResult | null;
  created_at: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function loadFiles() {
    try {
      const res = await fetch("/api/files");
      if (!res.ok) return;
      const data = await res.json() as { files: FileItem[] };
      setFiles(data.files ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadFiles(); }, []);

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    let successCount = 0;
    for (const file of Array.from(fileList)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/files/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json() as { file: FileItem };
        setFiles((prev) => [data.file, ...prev]);
        successCount++;
      } else {
        const err = await res.json() as { error: string };
        showToast(`Erreur upload ${file.name}: ${err.error}`, "error");
      }
    }
    if (successCount > 0) showToast(`${successCount} fichier(s) uploadé(s)`);
    setUploading(false);
  }

  async function analyzeFile(fileId: string) {
    setAnalyzingId(fileId);
    setFiles((prev) =>
      prev.map((f) => f.id === fileId ? { ...f, analysis_status: "processing" } : f)
    );
    const res = await fetch("/api/files/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    });
    if (res.ok) {
      const data = await res.json() as { result: AnalysisResult };
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, analysis_status: "done", analysis_result: data.result } : f
        )
      );
      setExpandedId(fileId);
      showToast("Analyse terminée !");
    } else {
      const err = await res.json() as { error: string };
      setFiles((prev) =>
        prev.map((f) => f.id === fileId ? { ...f, analysis_status: "error" } : f)
      );
      showToast(`Erreur analyse: ${err.error}`, "error");
    }
    setAnalyzingId(null);
  }

  async function deleteFile(fileId: string, name: string) {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    setDeletingId(fileId);
    const res = await fetch("/api/files/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    });
    if (res.ok) {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      showToast("Fichier supprimé");
    } else {
      showToast("Erreur lors de la suppression", "error");
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 text-[11px] uppercase tracking-[0.12em] font-medium shadow-lg animate-fade-up ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-gold text-black"
        }`}>
          {toast.msg}
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold status-pulse" />
          <span className="tag">Fichiers</span>
        </div>
        <h1 className="font-serif text-display text-white">Documents</h1>
        <p className="text-body text-grey mt-1">
          Uploadez vos documents pour que l&apos;IA puisse analyser le fonctionnement de votre entreprise.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          void uploadFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragActive ? "border-gold bg-gold/[0.04]" : "border-border-dim hover:border-border"
        }`}
      >
        {uploading ? (
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-gold animate-spin" />
        ) : (
          <Upload className={`w-8 h-8 mx-auto mb-4 ${dragActive ? "text-gold" : "text-grey"}`} />
        )}
        <p className="text-small text-white mb-1">
          {uploading ? "Upload en cours..." : (
            <>
              Glissez vos fichiers ici ou{" "}
              <span
                className="text-gold cursor-pointer hover:text-gold-light"
                onClick={() => fileInputRef.current?.click()}
              >
                parcourez
              </span>
            </>
          )}
        </p>
        <p className="text-[10px] text-grey">PDF, DOCX, XLSX, CSV — Max 25 MB par fichier</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.xlsx,.csv,.txt"
          className="hidden"
          onChange={(e) => void uploadFiles(e.target.files)}
        />
      </div>

      {/* Files List */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">Documents uploadés ({files.length})</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-gold animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="bg-grey-light border border-border-dim rounded-2xl p-12 text-center">
            <FileText className="w-8 h-8 text-grey mx-auto mb-3" />
            <p className="text-body text-grey">Aucun document uploadé</p>
          </div>
        ) : (
          <div className="space-y-[2px]">
            {files.map((file, i) => (
              <div key={file.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="bg-grey-light border border-border-dim rounded-2xl p-4 flex items-center justify-between card-hover group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-border rounded-xl flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-small text-white">{file.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-mono text-[10px] text-gold">{file.type}</span>
                        <span className="text-[10px] text-grey">{formatSize(file.size)}</span>
                        <span className="text-[10px] text-grey">
                          {new Date(file.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.analysis_status === "done" ? (
                      <button
                        onClick={() => setExpandedId(expandedId === file.id ? null : file.id)}
                        className="flex items-center gap-1.5 px-2 py-1 bg-gold/10 hover:bg-gold/20 transition-colors rounded-lg"
                      >
                        <Brain className="w-3 h-3 text-gold" />
                        <span className="text-[9px] text-gold uppercase tracking-wider">Analyse</span>
                        {expandedId === file.id ? (
                          <ChevronUp className="w-3 h-3 text-gold" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-gold" />
                        )}
                      </button>
                    ) : file.analysis_status === "processing" || analyzingId === file.id ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-gold/10 rounded-lg">
                        <Loader2 className="w-3 h-3 text-gold animate-spin" />
                        <span className="text-[9px] text-gold uppercase tracking-wider">Analyse...</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => void analyzeFile(file.id)}
                        disabled={!!analyzingId}
                        className="flex items-center gap-1.5 px-2 py-1 bg-grey/10 hover:bg-gold/10 hover:text-gold transition-colors rounded-lg"
                      >
                        <Clock className="w-3 h-3 text-grey" />
                        <span className="text-[9px] text-grey uppercase tracking-wider">Analyser</span>
                      </button>
                    )}
                    <button
                      onClick={() => void deleteFile(file.id, file.name)}
                      disabled={deletingId === file.id}
                      className="p-1.5 text-grey hover:text-red-400 transition-colors"
                    >
                      {deletingId === file.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Analysis Panel */}
                {expandedId === file.id && file.analysis_result && (
                  <div className="bg-black border border-gold/20 rounded-b-2xl p-6 space-y-4 animate-fade-up">
                    <p className="text-[11px] text-grey leading-relaxed">{file.analysis_result.summary}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: "Processus métier", items: file.analysis_result.processes, color: "text-gold" },
                        { label: "Opportunités IA", items: file.analysis_result.automations, color: "text-emerald-400" },
                        { label: "Inefficacités", items: file.analysis_result.inefficiencies, color: "text-red-400" },
                      ].map((section) => (
                        <div key={section.label}>
                          <p className={`text-[10px] uppercase tracking-widest mb-2 ${section.color}`}>{section.label}</p>
                          <ul className="space-y-1">
                            {section.items.map((item, j) => (
                              <li key={j} className="text-[11px] text-grey flex items-start gap-1.5">
                                <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${section.color.replace("text-", "bg-")}`} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
