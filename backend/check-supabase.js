require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing DIRECT_URL/DATABASE_URL in environment');

  const client = new Client({ connectionString: url });
  await client.connect();

  const tablesRes = await client.query(
    "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name"
  );

  const tables = tablesRes.rows.map((r) => r.table_name);
  console.log('Tables in public:', tables);

  const counts = {};
  for (const table of tables) {
    const countRes = await client.query(`select count(*)::int as c from "${table}"`);
    counts[table] = countRes.rows[0].c;
  }
  console.log('Row counts:', counts);

  if (tables.includes('Category') && tables.includes('Product')) {
    const byCategory = await client.query(
      'select c.name as category, count(p.*)::int as products ' +
        'from "Category" c left join "Product" p on p."categoryId" = c.id ' +
        'group by c.name order by products desc'
    );
    console.log('Products per category:', byCategory.rows);
  }

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
