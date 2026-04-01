const { Client } = require('pg');

const projectRef = 'qnbfeqbirwniobzoiohy';
const password = 'Password@12Password@1';
const regions = ['ap-south-1','ap-southeast-1','us-east-1','eu-west-1','us-west-1','eu-central-1','ap-northeast-1','sa-east-1'];

async function testRegion(region) {
  const connStr = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:5432/postgres?sslmode=require`;
  const client = new Client({ connectionString: connStr, connectionTimeoutMillis: 8000 });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 as test');
    console.log(`${region}: SUCCESS! ✅`);
    await client.end();
    return true;
  } catch (e) {
    console.log(`${region}: ${e.message.substring(0, 80)}`);
    try { await client.end(); } catch {}
    return false;
  }
}

(async () => {
  for (const r of regions) {
    const ok = await testRegion(r);
    if (ok) {
      console.log(`\nFOUND REGION: ${r}`);
      console.log(`DATABASE_URL=postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-${r}.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`);
      console.log(`DIRECT_URL=postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-${r}.pooler.supabase.com:5432/postgres?sslmode=require`);
      break;
    }
  }
})();
