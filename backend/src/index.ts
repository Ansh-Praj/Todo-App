import express from 'express'
import cors from 'cors'
import { router } from './routes/index.js'


const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/api/v1', router)

app.listen(PORT, ()=> console.log("Listening on port", PORT))
