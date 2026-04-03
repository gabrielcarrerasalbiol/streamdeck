# StreamDeck Virtual

Dashboard tipo StreamDeck para controlar el Mac Mini desde la Raspberry Pi.

## Características

- ✅ **Múltiples páginas de botones** - Navegación fluida entre páginas
- ✅ **Configuración visual** - Settings con tabla de botones
- ✅ **Ejecución remota** - Comandos bash ejecutados en Mac Mini
- ✅ **Iconos personalizables** - Imágenes desde URLs
- ✅ **Persistencia** - Configuración guardada en JSON

## Uso

1. **Ver dashboard**: `http://[IP-MAC-MINI]:3000`
2. **Configurar botones**: Click en ⚙️ → Settings
3. **Añadir botón**: Click en + en la posición deseada
4. **Ejecutar acción**: Click en el botón

## Ejemplos de acciones

```bash
# Abrir aplicación
open -a Safari

# Dormir Mac
osascript -e 'tell application "System Events" to sleep'

# Controlar volumen
osascript -e 'set volume output volume 50'

# Ejecutar script
~/scripts/mi-script.sh

# HTTP request
curl http://192.168.68.62/api/action
```

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Producción

```bash
pnpm build
pnpm start
```

---

**Creado:** 2026-04-03
**Basado en:** local-stats
**Propósito:** Control remoto tipo StreamDeck
