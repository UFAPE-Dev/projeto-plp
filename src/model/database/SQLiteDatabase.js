import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase("db.db")

db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () => {})

export default db
