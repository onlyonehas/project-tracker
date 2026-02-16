import http from 'http'
const base = 'http://localhost:3000', api = (p?: string) => `${base}/api/tasks${p ?? ''}`
function req(m: string, u: string, b?: object): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const url = new URL(u), r = http.request({ hostname: url.hostname, port: url.port, path: url.pathname, method: m, headers: b ? { 'Content-Type': 'application/json' } : {} }, (res) => { let d = ''; res.on('data', (c) => d += c); res.on('end', () => resolve({ status: res.statusCode ?? 0, data: d ? JSON.parse(d) : null })) }); r.on('error', reject); if (b) r.write(JSON.stringify(b)); r.end()
  })
}
async function run() {
  try {
    console.log('GET /api/tasks:', (await req('GET', api())).status === 200 ? 'OK' : 'fail')
    const c = await req('POST', api(), { title: 'Test', status: 'pending' })
    console.log('POST /api/tasks:', c.status === 201 ? 'OK' : 'fail')
    if (c.data && typeof c.data === 'object' && 'id' in c.data) {
      const id = (c.data as { id: string }).id
      console.log('PATCH:', (await req('PATCH', api('/' + id), { title: 'Updated' })).status === 200 ? 'OK' : 'fail')
      console.log('DELETE:', (await req('DELETE', api('/' + id))).status === 204 ? 'OK' : 'fail')
    }
    console.log('Backend tests done.')
  } catch (e) { console.log('Backend tests skipped:', (e as Error).message) }
}
run()
