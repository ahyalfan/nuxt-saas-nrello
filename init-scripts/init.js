db.createUser({
  user: 'root',
  pwd: 'example',
  roles: [{ role: 'readWrite', db: 'nrello' }],
});

// // Buat koleksi dan tambahkan dokumen contoh
// db.createCollection('users');
// db.users.insertMany([
//   { name: 'Alice', email: 'alice@example.com' },
//   { name: 'Bob', email: 'bob@example.com' },
// ]);
