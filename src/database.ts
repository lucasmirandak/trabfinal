import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';

let instance: Database | null = null;

export async function connect() {
  if (instance) 
    return instance;

  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  });
  
  // Criação das tabelas caso não existam
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT,
      senha TEXT
    );

    CREATE TABLE IF NOT EXISTS filmes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT,
      ano INTEGER,
      genero TEXT,
      duracao INTEGER,
      sinopse TEXT
    );

    CREATE TABLE IF NOT EXISTS diretores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      dataNascimento TEXT,
      nacionalidade TEXT,
      premiacoes TEXT,
      biografia TEXT
    );

    CREATE TABLE IF NOT EXISTS produtoras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      fundacao TEXT,
      paisOrigem TEXT,
      site TEXT,
      descricao TEXT
    );
  `);
  
  return instance = db;
}
