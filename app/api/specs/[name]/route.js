import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function GET(request, { params }) {
  const { name } = params
  if (!/^[a-z0-9_-]+$/.test(name)) {
    return new Response('Invalid spec name', { status: 400 })
  }
  const filePath = join(process.cwd(), 'apps', `${name}.json`)
  if (!existsSync(filePath)) {
    return new Response(JSON.stringify({ error: 'Spec not found', name }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  try {
    const content = readFileSync(filePath, 'utf8')
    return new Response(content, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      }
    })
  } catch {
    return new Response('Error reading spec', { status: 500 })
  }
}
