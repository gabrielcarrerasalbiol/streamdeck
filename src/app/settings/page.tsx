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

export default function Settings() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState(0);
  const [editingButton, setEditingButton] = useState<Button | null>(null);
  const [loading, setLoading] = useState(true);

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

  const saveConfig = async (updatedPages: Page[]) => {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pages: updatedPages })
    });
    setPages(updatedPages);
  };

  const saveButton = (button: Button) => {
    const updatedPages = [...pages];
    const idx = updatedPages[selectedPage].buttons.findIndex(b => b.id === button.id);
    if (idx >= 0) updatedPages[selectedPage].buttons[idx] = button;
    else updatedPages[selectedPage].buttons.push(button);
    saveConfig(updatedPages);
    setEditingButton(null);
  };

  const deleteButton = (buttonId: string) => {
    const updatedPages = [...pages];
    updatedPages[selectedPage].buttons = updatedPages[selectedPage].buttons.filter(b => b.id !== buttonId);
    saveConfig(updatedPages);
  };

  if (loading) return <div style={{ padding: 40 }}>Cargando...</div>;

  const currentButtons = pages[selectedPage]?.buttons || [];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="back-button" onClick={() => router.push('/')}>← Volver</button>
        <h1>Configuración StreamDeck</h1>
      </div>

      <div className="page-selector">
        <label>Página:</label>
        <select value={selectedPage} onChange={e => setSelectedPage(Number(e.target.value))}>
          {pages.map((page, index) => (
            <option key={page.id} value={index}>{page.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={pages[selectedPage]?.name || ''}
          onChange={e => {
            const updatedPages = [...pages];
            updatedPages[selectedPage].name = e.target.value;
            saveConfig(updatedPages);
          }}
          placeholder="Nombre de página"
        />
      </div>

      <div className="buttons-table">
        <table>
          <thead>
            <tr>
              <th>Posición</th>
              <th>Etiqueta</th>
              <th>Imagen</th>
              <th>Acción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => {
              const button = currentButtons.find(b => b.position === index);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{button?.label || '-'}</td>
                  <td>
                    {button?.image ? (
                      <img src={button.image} alt={button.label} className="table-icon" />
                    ) : (
                      <span className="no-image">Sin imagen</span>
                    )}
                  </td>
                  <td><code className="action-preview">{button?.action || '-'}</code></td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => setEditingButton(button || {
                        id: `btn-${Date.now()}`,
                        label: '',
                        image: '',
                        action: '',
                        page: selectedPage,
                        position: index
                      })}
                    >
                      {button ? '✏️' : '+'}
                    </button>
                    {button && (
                      <button className="delete-button" onClick={() => deleteButton(button.id)}>🗑️</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingButton && (
        <div className="modal-overlay" onClick={() => setEditingButton(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingButton.label ? 'Editar Botón' : 'Nuevo Botón'}</h2>
            <form onSubmit={e => {
              e.preventDefault();
              saveButton(editingButton);
            }}>
              <div className="form-group">
                <label>Etiqueta:</label>
                <input
                  type="text"
                  value={editingButton.label}
                  onChange={e => setEditingButton({ ...editingButton, label: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Imagen (URL):</label>
                <input
                  type="url"
                  value={editingButton.image || ''}
                  onChange={e => setEditingButton({ ...editingButton, image: e.target.value })}
                  placeholder="https://ejemplo.com/icono.png"
                />
              </div>
              <div className="form-group">
                <label>Acción (comando bash):</label>
                <textarea
                  value={editingButton.action}
                  onChange={e => setEditingButton({ ...editingButton, action: e.target.value })}
                  placeholder="open -a Safari"
                  rows={4}
                  required
                />
              </div>
              <div className="form-group">
                <label>Posición: {editingButton.position + 1}</label>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-button">Guardar</button>
                <button type="button" className="cancel-button" onClick={() => setEditingButton(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="global-actions">
        <button
          className="add-page-button"
          onClick={async () => {
            const newPage = { id: Date.now(), name: `Página ${pages.length + 1}`, buttons: [] };
            await saveConfig([...pages, newPage]);
            setSelectedPage(pages.length);
          }}
        >
          ➕ Nueva Página
        </button>
        <button
          className="export-button"
          onClick={() => {
            const data = JSON.stringify({ pages }, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'streamdeck-config.json';
            a.click();
          }}
        >
          📤 Exportar Config
        </button>
      </div>
    </div>
  );
}
