import { useState, useEffect } from 'react';
import { aiAPI, documentAPI } from '../services/api';

export default function AIInterpreterPage() {
  const [docs, setDocs] = useState([]);
  const [interpretations, setInterpretations] = useState([]);
  const [interpreting, setInterpreting] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [d, i] = await Promise.all([documentAPI.getList(), aiAPI.getInterpretations()]);
      setDocs(d.data.results || d.data || []);
      setInterpretations(i.data.results || i.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInterpret = async (docId) => {
    setInterpreting(docId);
    try {
      await aiAPI.interpret(docId);
      alert('Interpretation completed');
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to interpret');
    } finally {
      setInterpreting(null);
    }
  };

  const getInterp = (docId) => interpretations.find((i) => i.document === docId);

  return (
    <div className="page">
      <h2>AI Document Interpreter</h2>
      <p className="muted" style={{ marginBottom: 'var(--space-lg)' }}>
        Select a document to interpret with AI
      </p>
      {docs.length === 0 ? (
        <div className="card"><p className="muted">No documents available. Upload documents first.</p></div>
      ) : (
        docs.map((doc) => {
          const interp = getInterp(doc.id);
          return (
            <div key={doc.id} className="card">
              <strong>{doc.title}</strong>
              <span className="chip chip-default">{doc.document_type}</span>
              {interp ? (
                <div className="interp-box">
                  <span className="chip chip-success">Interpreted</span>
                  <p>{interp.summary}</p>
                  {interp.key_findings?.length > 0 && (
                    <div>
                      <strong>Key Findings:</strong>
                      <ul>{interp.key_findings.map((f, i) => <li key={i}>{f}</li>)}</ul>
                    </div>
                  )}
                  {interp.recommendations?.length > 0 && (
                    <div>
                      <strong>Recommendations:</strong>
                      <ul>{interp.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
                    </div>
                  )}
                  {interp.confidence_score && (
                    <p className="muted">Confidence: {(interp.confidence_score * 100).toFixed(1)}%</p>
                  )}
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => handleInterpret(doc.id)}
                  disabled={interpreting === doc.id}
                >
                  {interpreting === doc.id ? 'Interpreting...' : 'Interpret with AI'}
                </button>
              )}
            </div>
          );
        })
      )}
      <style>{`
        .interp-box { margin-top: var(--space-md); padding: var(--space-md); background: rgba(15,118,110,0.06); border-radius: var(--radius-md); }
        .interp-box ul { margin: var(--space-xs) 0; padding-left: var(--space-lg); }
      `}</style>
    </div>
  );
}
