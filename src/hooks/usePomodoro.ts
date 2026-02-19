import { useState, useEffect, useRef, useCallback } from "react"
import { DEFAULT_POMODORO_DURATION, TIMER_TICK_INTERVAL } from "@/constants/pomodoro"

interface UsePomodoroOptions {
  duration?: number
  onComplete?: () => void
}

export function usePomodoro({
  duration = DEFAULT_POMODORO_DURATION,
  onComplete,
}: UsePomodoroOptions = {}) {
  const [timeRemaining, setTimeRemaining] = useState(duration)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [pausedTime, setPausedTime] = useState(0)

  const intervalRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Calculate time remaining based on start time to prevent drift
  const calculateTimeRemaining = useCallback(() => {
    if (!startTime) return duration

    const now = Date.now()
    const elapsed = Math.floor((now - startTime - pausedTime) / 1000)
    const remaining = Math.max(0, duration - elapsed)

    return remaining
  }, [startTime, duration, pausedTime])

  // Timer tick
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        const remaining = calculateTimeRemaining()
        setTimeRemaining(remaining)

        if (remaining <= 0) {
          setIsActive(false)
          setIsPaused(false)

          // Play notification sound
          if (audioRef.current) {
            audioRef.current.play().catch((error) => {
              console.error("Error playing notification sound:", error)
            })
          }

          // Call onComplete callback
          if (onComplete) {
            onComplete()
          }
        }
      }, TIMER_TICK_INTERVAL)

      return () => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [isActive, isPaused, calculateTimeRemaining, onComplete])

  // Initialize audio element
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const context = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    oscillator.frequency.value = 800
    gainNode.gain.value = 0.3

    // Store audio context for later use
    audioRef.current = {
      play: () => {
        const osc = context.createOscillator()
        const gain = context.createGain()

        osc.connect(gain)
        gain.connect(context.destination)

        osc.frequency.value = 800
        gain.gain.value = 0.3

        osc.start()
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5)
        osc.stop(context.currentTime + 0.5)

        return Promise.resolve()
      },
    } as any

    return () => {
      context.close()
    }
  }, [])

  const start = useCallback(() => {
    setIsActive(true)
    setIsPaused(false)
    setStartTime(Date.now())
    setPausedTime(0)
    setTimeRemaining(duration)
  }, [duration])

  const pause = useCallback(() => {
    if (isActive && !isPaused) {
      setIsPaused(true)
      const now = Date.now()
      if (startTime) {
        setPausedTime((prev) => prev + (now - startTime - pausedTime))
      }
    }
  }, [isActive, isPaused, startTime, pausedTime])

  const resume = useCallback(() => {
    if (isActive && isPaused) {
      setIsPaused(false)
      setStartTime(Date.now())
    }
  }, [isActive, isPaused])

  const reset = useCallback(() => {
    setIsActive(false)
    setIsPaused(false)
    setStartTime(null)
    setPausedTime(0)
    setTimeRemaining(duration)

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
    }
  }, [duration])

  return {
    timeRemaining,
    isActive,
    isPaused,
    start,
    pause,
    resume,
    reset,
    startTime,
  }
}
