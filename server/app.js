import express from "express"
import cors from "cors"
import cppRoutes from "./routes/cpp.js"

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: "1mb" }))
app.use("/", cppRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})