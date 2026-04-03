import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'streamdeck-config.json');

// Configuración por defecto
const DEFAULT_CONFIG = {
  pages: [
    {
      id: 1,
      name: 'Apps',
      buttons: [
        {
          id: 'btn-1',
          label: 'Chrome',
          image: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Chrome_icon_%28September_2014%29.svg',
          action: 'open -a "Google Chrome"',
          page: 0,
          position: 0
        },
        {
          id: 'btn-2',
          label: 'Firefox',
          image: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg',
          action: 'open -a Firefox',
          page: 0,
          position: 1
        },
        {
          id: 'btn-3',
          label: 'Warp',
          image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terminal/terminal-original.svg',
          action: 'open -a Warp',
          page: 0,
          position: 2
        },
        {
          id: 'btn-4',
          label: 'Claude',
          image: 'https://cdn-icons-png.flaticon.com/512/6132/6132222.png',
          action: 'open -a Claude',
          page: 0,
          position: 3
        },
        {
          id: 'btn-5',
          label: 'Perplexity',
          image: 'https://www.perplexity.ai/favicon.ico',
          action: 'open -a Perplexity',
          page: 0,
          position: 4
        },
        {
          id: 'btn-6',
          label: 'VS Code',
          image: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
          action: 'open -a "Visual Studio Code"',
          page: 0,
          position: 5
        },
        {
          id: 'btn-7',
          label: 'FileZilla',
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/FileZilla_logo.svg/1200px-FileZilla_logo.svg.png',
          action: 'open -a FileZilla',
          page: 0,
          position: 6
        },
        {
          id: 'btn-8',
          label: 'Ajustes Mac',
          image: 'https://cdn-icons-png.flaticon.com/512/2099/2099058.png',
          action: 'open -a "System Preferences"',
          page: 0,
          position: 7
        },
        {
          id: 'btn-9',
          label: 'Apagar Pantalla',
          image: 'https://cdn-icons-png.flaticon.com/512/1829/1829649.png',
          action: 'pmset displaysleepnow',
          page: 0,
          position: 8
        },
        {
          id: 'btn-10',
          label: 'Dormir Mac',
          image: 'https://cdn-icons-png.flaticon.com/512/2344/2344400.png',
          action: 'osascript -e \'tell application "System Events" to sleep\'',
          page: 0,
          position: 9
        }
      ]
    },
    {
      id: 2,
      name: 'Stats & Widgets',
      buttons: [
        {
          id: 'btn-stats',
          label: '📊 Local Stats',
          image: 'https://cdn-icons-png.flaticon.com/512/2785/2785.png',
          action: 'open http://192.168.68.212:3000',
          page: 1,
          position: 0
        },
        {
          id: 'btn-immich',
          label: '📷 Immich',
          image: 'https://cdn-icons-png.flaticon.com/512/1041/1041897.png',
          action: 'open http://192.168.68.62:2283',
          page: 1,
          position: 1
        },
        {
          id: 'btn-pihole',
          label: '🛡️ PiHole',
          image: 'https://cdn-icons-png.flaticon.com/512/2621/2621.png',
          action: 'open http://192.168.1.210/admin',
          page: 1,
          position: 2
        },
        {
          id: 'btn-terminal',
          label: '💻 Terminal',
          image: 'https://cdn-icons-png.flaticon.com/512/7162/7162249.png',
          action: 'open -a Terminal',
          page: 1,
          position: 3
        },
        {
          id: 'btn-finder',
          label: '📁 Finder',
          image: 'https://cdn-icons-png.flaticon.com/512/2621/2621.png',
          action: 'open -a Finder',
          page: 1,
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
