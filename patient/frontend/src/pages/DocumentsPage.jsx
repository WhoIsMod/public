import { useState, useEffect, useRef } from 'react';
import { documentAPI } from '../services/api';

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const { data } = await documentAPI.getList();
      setDocs(data.results || data || []);
    } catch (e) {
      alert('Failed to load documents');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', file.name);
      fd.append('document_type', 'OTHER');
      fd.append('description', 'Uploaded document');
      await documentAPI.upload(fd);
      alert('Document uploaded');
      load();
    } catch (err) {
      alert('Failed to upload');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const { data } = await documentAPI.download(id);
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = title || 'document';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to download');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return;
    try {
      await documentAPI.delete(id);
      load();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Documents</h2>
        <input type="file" ref={fileRef} onChange={handleFileChange} style={{ display: 'none' }} />
        <button className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading...' : '+ Upload'}
        </button>
      </div>
      {docs.map((d) => (
        <div key={d.id} className="card">
          <div className="card-head">
            <strong>{d.title}</strong>
            <span className="chip chip-default">{d.document_type}</span>
          </div>
          {d.description && <p className="muted">{d.description}</p>}
          {d.date_issued && <p className="muted">Issued: {new Date(d.date_issued).toLocaleDateString()}</p>}
          <div className="card-foot">
            <button className="btn btn-outline btn-sm" onClick={() => handleDownload(d.id, d.title)}>Download</button>
            <button className="btn btn-outline btn-sm" onClick={() => handleDelete(d.id)}>Delete</button>
          </div>
        </div>
      ))}
      {docs.length === 0 && <div className="card"><p className="muted">No documents</p></div>}
      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); }
        .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm); }
        .card-foot { display: flex; gap: var(--space-sm); margin-top: var(--space-sm); }
        .btn-sm { padding: var(--space-xs) var(--space-md); font-size: 0.85rem; }
      `}</style>
    </div>
  );
}
