import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { fileURLToPath } from "url"
import { dirname } from "path"

// Required for __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const runCpp = (code) => {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(__dirname, "..", "temp")
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }

    // Create unique filenames for the source and executable
    const cppFilePath = path.join(tempDir, "main.cpp")
    const exeFilePath = path.join(tempDir, process.platform === "win32" ? "main.exe" : "main")

    fs.writeFileSync(cppFilePath, code)

    // Compile command - using g++ for C++
    const compileCommand = `g++ "${cppFilePath}" -o "${exeFilePath}"`
    
    // Run command
    const runCommand = process.platform === "win32" ? `"${exeFilePath}"` : `"${exeFilePath}"`

    exec(compileCommand, (compileErr, _, compileStderr) => {
      if (compileErr || compileStderr) {
        cleanup()
        return resolve({ output: "Compilation Error:\n" + (compileErr?.message || compileStderr) })
      }

      exec(runCommand, { timeout: 5000 }, (runErr, stdout, stderr) => {
        cleanup()
        if (runErr || stderr) {
          return resolve({ output: "Runtime Error:\n" + (runErr?.message || stderr) })
        }

        resolve({ output: stdout })
      })
    })

    const cleanup = () => {
      try {
        if (fs.existsSync(javaFilePath)) fs.unlinkSync(javaFilePath)
        if (fs.existsSync(classFilePath)) fs.unlinkSync(classFilePath)
      } catch (err) {
        console.error("Error cleaning up files:", err.message)
      }
    }
  })
}

export default runCpp
export { runCpp }