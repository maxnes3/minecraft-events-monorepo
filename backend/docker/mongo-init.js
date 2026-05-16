db = db.getSiblingDB('admin');

db.createUser({
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
  roles: [
    { role: 'root', db: 'admin' },
    { role: 'readWrite', db: process.env.MONGO_INITDB_DATABASE }
  ]
});

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

print('MongoDB initialization completed!');