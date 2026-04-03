'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Button {
  id: string;
  label: string;
  image?: string;
  action: string;
  page: number;
  position: number;
}

interface Page {
  id: number;
  name: string;
  buttons: Button[];
}

export default function StreamDeck() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);

  // Cargar configuración
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setPages(data.pages || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading config:', err);
        setLoading(false);
      });
  }, []);

  // Ejecutar acción del botón
  const executeAction = async (button: Button) => {
    if (!button.action || executing) return;

    setExecuting(button.id);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: button.action })
      });

      const data = await res.json();
      if (data.success) {
        console.log('✅ Action executed:', button.label);
      } else {
        console.error('❌ Action failed:', data.error);
      }
    } catch (err) {
      console.error('❌ Execution error:', err);
    } finally {
      setTimeout(() => setExecuting(null), 300);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando StreamDeck...</p>
      </div>
    );
  }

  // Página 2: Iframe de local-stats
  if (currentPage === 1) {
    return (
      <div className="iframe-container">
        <div className="iframe-header">
          <button
            className="nav-button"
            onClick={() => setCurrentPage(0)}
          >
            ◀ Volver
          </button>
          <span className="page-title">📊 Stats & Widgets</span>
          <button
            className="settings-button"
            onClick={() => router.push('/settings')}
          >
            ⚙️
          </button>
        </div>
        <iframe
          src="http://192.168.68.212:3000"
          className="stats-iframe"
          title="Local Stats"
        />
        <style jsx>{`
          .iframe-container {
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: #000;
          }
          .iframe-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: linear-gradient(180deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.9) 100%);
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          .page-title {
            color: #fff;
            font-size: 16px;
            font-weight: 600;
          }
          .nav-button {
            background: rgba(0,122,255,0.2);
            border: 1px solid rgba(0,122,255,0.3);
            color: #007aff;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          }
          .nav-button:hover {
            background: rgba(0,122,255,0.3);
          }
          .settings-button {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
          }
          .stats-iframe {
            flex: 1;
            width: 100%;
            border: none;
            background: #000;
          }
        `}</style>
      </div>
    );
  }

  // Página 1: Grid de botones
  const currentButtons = pages[currentPage]?.buttons || [];
  const totalButtons = 10; // 2 filas x 5 columnas

  return (
    <div className="streamdeck-container">
      {/* Header con información de página */}
      <div className="streamdeck-header">
        <button
          className="nav-button"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          ◀
        </button>
        <div className="page-info">
          <span className="page-name">{pages[currentPage]?.name || `Página ${currentPage + 1}`}</span>
          <span className="page-indicator">{currentPage + 1} / {pages.length || 1}</span>
        </div>
        <button
          className="nav-button"
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          disabled={currentPage >= pages.length - 1}
        >
          ▶
        </button>
        <button
          className="settings-button"
          onClick={() => router.push('/settings')}
        >
          ⚙️
        </button>
      </div>

      {/* Grid de botones */}
      <div className="button-grid">
        {Array.from({ length: totalButtons }).map((_, index) => {
          const button = currentButtons.find(b => b.position === index);
          const isExecuting = executing === button?.id;

          return (
            <button
              key={index}
              className={`deck-button ${isExecuting ? 'executing' : ''} ${!button ? 'empty' : ''}`}
              onClick={() => button && executeAction(button)}
              disabled={!button || isExecuting}
            >
              {button ? (
                <>
                  {button.image ? (
                    <img src={button.image} alt={button.label} className="button-icon" />
                  ) : (
                    <div className="button-placeholder">🔘</div>
                  )}
                  <span className="button-label">{button.label}</span>
                </>
              ) : (
                <span className="empty-slot">+</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer con navegación rápida de páginas */}
      <div className="streamdeck-footer">
        {pages.map((page, index) => (
          <button
            key={page.id}
            className={`page-dot ${currentPage === index ? 'active' : ''}`}
            onClick={() => setCurrentPage(index)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="add-page-button"
          onClick={async () => {
            const newPage = {
              id: Date.now(),
              name: `Página ${pages.length + 1}`,
              buttons: []
            };
            const updatedPages = [...pages, newPage];
            setPages(updatedPages);
            await fetch('/api/config', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pages: updatedPages })
            });
            setCurrentPage(updatedPages.length - 1);
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
