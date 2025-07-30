import { Routes, Route } from "react-router-dom"
import CppEditor from "./pages/CppEditor"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CppEditor />} />
    </Routes>
  )
}