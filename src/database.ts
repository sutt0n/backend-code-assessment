import {Client} from 'pg'


export function getClient() {
    const client = new Client({
        user: 'user',
        host: 'localhost',
        database: 'db',
        password: 'pass',
        port: 5432,
      })

      return client
}