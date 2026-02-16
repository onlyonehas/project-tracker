import http from 'http'

const base = 'http://localhost:3000'
const api = (path?: string) => `${base}/api/tasks${path ?? ''}`

function request(method: string, url: string, body?: object): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {}
      },
      (res: http.IncomingMessage) => {
        let data = ''
        res.on('data', (c: string) => (data += c))
        res.on('end', () => resolve({ status: res.statusCode ?? 0, data: data ? JSON.parse(data) : null }))
      }
    )
    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function run() {
  try {
    const list = await request('GET', api())
    console.log('GET /api/tasks:', list.status === 200 ? 'OK' : list.status)
    const create = await request('POST', api(), { title: 'Test', status: 'pending' })
    console.log('POST /api/tasks:', create.status === 201 ? 'OK' : create.status)
    if (create.data && typeof create.data === 'object' && 'id' in create.data) {
      const id = (create.data as { id: string }).id
      const getOne = await request('GET', api('/' + id))
      console.log('GET /api/tasks/:id:', getOne.status === 200 ? 'OK' : getOne.status)
      const patch = await request('PATCH', api('/' + id), { title: 'Updated' })
      console.log('PATCH /api/tasks/:id:', patch.status === 200 ? 'OK' : patch.status)
      const del = await request('DELETE', api('/' + id))
      console.log('DELETE /api/tasks/:id:', del.status === 204 ? 'OK' : del.status)
    }
    console.log('Backend tests done.')
  } catch (e) {
    console.log('Backend tests skipped (start server with: npm run dev:backend):', (e as Error).message)
  }
}

run()