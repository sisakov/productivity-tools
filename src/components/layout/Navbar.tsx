import { Link, useLocation } from "react-router-dom"
import { Timer, ChevronDown, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/context/ThemeContext"

const PAGES = [
  { to: "/", label: "Home" },
  { to: "/pomodoro", label: "Pomodoro Timer" },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const currentPage = PAGES.find((p) => p.to === location.pathname) ?? PAGES[0]

  return (
    <header className="border-b sticky top-0 z-50 backdrop-blur-md bg-background/80">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Timer className="h-5 w-5 text-red-500" />
          <span>Productivity</span>
        </Link>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                {currentPage.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PAGES.map((page) => (
                <DropdownMenuItem key={page.to} asChild>
                  <Link to={page.to}>{page.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
