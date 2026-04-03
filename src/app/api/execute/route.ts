import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// POST - Ejecutar acción
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (!action) {
      return NextResponse.json({ error: 'No action provided' }, { status: 400 });
    }

    console.log('🚀 Executing action:', action);

    // Ejecutar comando bash en Mac Mini
    const { stdout, stderr } = await execAsync(action, {
      timeout: 10000, // 10 segundos máximo
      shell: '/bin/bash'
    });

    if (stderr) {
      console.warn('⚠️ Command stderr:', stderr);
    }

    console.log('✅ Command executed successfully:', stdout);

    return NextResponse.json({
      success: true,
      output: stdout,
      error: stderr || null
    });

  } catch (error: any) {
    console.error('❌ Execution error:', error);
    return NextResponse.json({
      error: error.message || 'Execution failed',
      details: error.stderr || null
    }, { status: 500 });
  }
}
