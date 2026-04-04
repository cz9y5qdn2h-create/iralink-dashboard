"use client";

import { useState } from "react";
import { FileText, Upload, Brain, Clock, Trash2, Eye } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  analyzed: boolean;
  uploaded_at: string;
}

const mockFiles: FileItem[] = [
  { id: "1", name: "organigramme-2026.pdf", type: "PDF", size: "2.4 MB", analyzed: true, uploaded_at: "2026-04-01" },
  { id: "2", name: "process-ventes.docx", type: "DOCX", size: "890 KB", analyzed: true, uploaded_at: "2026-03-28" },
  { id: "3", name: "budget-q1-2026.xlsx", type: "XLSX", size: "1.1 MB", analyzed: true, uploaded_at: "2026-03-25" },
  { id: "4", name: "workflows-equipe.pdf", type: "PDF", size: "3.2 MB", analyzed: false, uploaded_at: "2026-04-03" },
  { id: "5", name: "fiche-processus-rh.pdf", type: "PDF", size: "1.8 MB", analyzed: true, uploaded_at: "2026-03-20" },
];

export default function FilesPage() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold status-pulse" />
          <span className="tag">Fichiers</span>
        </div>
        <h1 className="font-serif text-display text-white">Documents</h1>
        <p className="text-body text-grey mt-1">
          Uploadez vos documents pour que l&apos;IA puisse analyser le fonctionnement
          de votre entreprise.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={() => setDragActive(false)}
        className={`border-2 border-dashed p-12 text-center transition-all duration-300 ${
          dragActive
            ? "border-gold bg-gold/[0.04]"
            : "border-border-dim hover:border-border"
        }`}
      >
        <Upload className={`w-8 h-8 mx-auto mb-4 ${dragActive ? "text-gold" : "text-grey"}`} />
        <p className="text-small text-white mb-1">
          Glissez vos fichiers ici ou{" "}
          <span className="text-gold cursor-pointer hover:text-gold-light">
            parcourez
          </span>
        </p>
        <p className="text-[10px] text-grey">
          PDF, DOCX, XLSX, CSV — Max 25 MB par fichier
        </p>
      </div>

      {/* Files List */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[22px] h-[2px] bg-gold" />
          <span className="tag">Documents uploades ({mockFiles.length})</span>
        </div>

        <div className="space-y-[2px]">
          {mockFiles.map((file, i) => (
            <div
              key={file.id}
              className="bg-grey-light border border-border-dim p-4 flex items-center justify-between card-hover group animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-border flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-small text-white">{file.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-[10px] text-gold">{file.type}</span>
                    <span className="text-[10px] text-grey">{file.size}</span>
                    <span className="text-[10px] text-grey">
                      {new Date(file.uploaded_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {file.analyzed ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-gold/10">
                    <Brain className="w-3 h-3 text-gold" />
                    <span className="text-[9px] text-gold uppercase tracking-wider">
                      Analyse
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-grey/10">
                    <Clock className="w-3 h-3 text-grey" />
                    <span className="text-[9px] text-grey uppercase tracking-wider">
                      En attente
                    </span>
                  </div>
                )}
                <button className="p-1.5 text-grey hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 text-grey hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
