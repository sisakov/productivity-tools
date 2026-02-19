import { HashRouter, Routes, Route } from "react-router-dom"
import { PomodoroProvider } from "@/context/PomodoroContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { Navbar } from "@/components/layout/Navbar"
import { HomePage } from "@/pages/HomePage"
import { PomodoroPage } from "@/pages/PomodoroPage"

function Layout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pomodoro" element={<PomodoroPage />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <PomodoroProvider>
        <HashRouter>
          <Layout />
        </HashRouter>
      </PomodoroProvider>
    </ThemeProvider>
  )
}

export default App
