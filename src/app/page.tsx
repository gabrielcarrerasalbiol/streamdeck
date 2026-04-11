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
        <button
          className="back-float-btn"
          onClick={() => setCurrentPage(0)}
        >
          ◀
        </button>
        <iframe
          src="http://192.168.68.212:3001"
          className="stats-iframe"
          title="Local Stats"
        />
        <style jsx>{`
          .iframe-container {
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: #000;
            position: relative;
          }
          .back-float-btn {
            position: absolute;
            top: 4px;
            left: 250px;
            z-index: 10;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
            padding: 6px 10px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            backdrop-filter: blur(10px);
          }
          .back-float-btn:hover {
            background: rgba(0, 0, 0, 0.8);
          }
          .stats-iframe {
            flex: 1;
            width: 100%;
            border: none;
            background: #000;
            height: 100vh;
          }
        `}</style>
      </div>
    );
  }

  // Página 1: Grid de botones - full screen
  const currentButtons = pages[currentPage]?.buttons || [];
  const totalButtons = 10; // 2 filas x 5 columnas

  return (
    <div className="streamdeck-container-full">
      {/* Header minimal */}
      <div className="streamdeck-header-minimal">
        <button
          className="nav-button"
          onClick={() => setCurrentPage(1)}
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
      <div className="button-grid-full">
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
    </div>
  );
}
