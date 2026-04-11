import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout } = await execAsync('/opt/homebrew/bin/get-toggle-states', {
      timeout: 5000,
    });
    const states = JSON.parse(stdout);
    return NextResponse.json(states);
  } catch (error) {
    return NextResponse.json({
      darkMode: false,
      volumeMuted: false,
      fanOn: false,
    });
  }
}
