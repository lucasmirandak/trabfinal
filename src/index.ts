import express, { RequestHandler } from 'express'
import { randomUUID } from 'crypto'
import { connect } from './database';

const port = 3000
const app = express()

const logged: any = {}

app.use(express.json())
app.use(express.static(__dirname + '/../public'))

app.post("/login", async (req, res) => {
    const { login, senha } = req.body
    //  const tokenAlread = isAlreadyLogged(username)
    //  if (tokenAlread)
    //    return res.status(401).json({
    //      error: "Usuário já está logado", 
    //      token: tokenAlread
    //    })
    
    const db = await connect()
    const user = await db.get(`SELECT * FROM users WHERE email = ? AND senha = ? LIMIT 1`, [login, senha])
    
    if (!user){
      res.status(401).json({ error: "Usuário ou senha inválidos" })
      return 
    }

    const token = randomUUID()
    logged[token] = user
    res.json({ token })
    return 
})

app.get('/users', async (req, res) => {
  const db = await connect()
  const users = await db.all('SELECT * FROM users')
  res.json(users)
})

app.post('/users', async (req, res) => {
  const db = await connect()
  const { nome, email, senha } = req.body
  const result = await db.run('INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha])
  const user = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID])
  res.json(user)
})

app.put('/users/:id', async (req, res) => {
  const db = await connect()
  const { name, email } = req.body
  const { id } = req.params
  await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id])
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id])
  res.json(user)
})

app.delete('/users/:id', async (req, res) => {
  const db = await connect()
  const { id } = req.params
  await db.run('DELETE FROM users WHERE id = ?', [id])
  res.json({ message: 'User deleted' })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})