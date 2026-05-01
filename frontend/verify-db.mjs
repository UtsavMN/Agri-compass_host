import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://agri-compass-utsavmn.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU1NDM4MjAsImlkIjoiMDE5ZDI5OGUtOTkwMS03OTE3LWI5YmMtMmY3NDBmMDQ2YjAyIiwicmlkIjoiY2MwZDMwMWItYzM1MS00YmUyLWE4ZTYtNzIwZDBjMzJjNWEzIn0.YRmwbBpfX_E5lMNixQh9aHOatJZJa89w3MyUb2naD8I_NTHt6q5SHSCqAVvgXoK2SaK5y3iaY9adlfKplw5gCg',
});

async function verify() {
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('📦 Tables in database:');
  tables.rows.forEach(row => console.log('  ✅ ' + row.name));

  const crops = await db.execute('SELECT COUNT(*) as c FROM crops');
  console.log('\n🌾 Crops seeded: ' + crops.rows[0].c);

  const recs = await db.execute('SELECT COUNT(*) as c FROM crop_recommendations');
  console.log('📍 Crop recommendations: ' + recs.rows[0].c);

  const cropNames = await db.execute('SELECT id, name, district FROM crops ORDER BY id');
  console.log('\n🌱 Crop Details:');
  cropNames.rows.forEach(r => console.log(`  ${r.id}. ${r.name} (${r.district})`));
}

verify().catch(console.error);
