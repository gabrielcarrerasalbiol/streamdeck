import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'streamdeck-config.json');

// Configuración por defecto
const DEFAULT_CONFIG = {
  pages: [
    {
      id: 1,
      name: 'Página Principal',
      buttons: [
        {
          id: 'btn-1',
          label: 'Safari',
          image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg',
          action: 'open -a Safari',
          page: 0,
          position: 0
        },
        {
          id: 'btn-2',
          label: 'Chrome',
          image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Chrome_icon_%28September_2014%29.svg',
          action: 'open -a "Google Chrome"',
          page: 0,
          position: 1
        },
        {
          id: 'btn-3',
          label: 'Terminal',
          image: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Terminalicon2.png',
          action: 'open -a Terminal',
          page: 0,
          position: 2
        },
        {
          id: 'btn-4',
          label: 'VS Code',
          image: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
          action: 'open -a "Visual Studio Code"',
          page: 0,
          position: 3
        },
        {
          id: 'btn-5',
          label: 'Sleep Mac',
          image: 'https://cdn-icons-png.flaticon.com/512/1829/1829649.png',
          action: 'osascript -e \'tell application "System Events" to sleep\'',
          page: 0,
          position: 4
        }
      ]
    }
  ]
};

// GET - Cargar configuración
export async function GET() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      // Crear archivo con config por defecto
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
      return NextResponse.json(DEFAULT_CONFIG);
    }

    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json(DEFAULT_CONFIG);
  }
}

// POST - Guardar configuración
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}
