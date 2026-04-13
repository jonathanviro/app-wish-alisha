import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - new Date().getTime()
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  }
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="mt-8 md:mt-10 flex justify-center">
      <div className="flex items-center gap-2 md:gap-3">
        <TimeUnit value={timeLeft.days} label="días" />
        <span className="text-lg md:text-2xl font-bold text-text/40 -mt-5">:</span>
        <TimeUnit value={timeLeft.hours} label="hrs" />
        <span className="text-lg md:text-2xl font-bold text-text/40 -mt-5">:</span>
        <TimeUnit value={timeLeft.minutes} label="min" />
        <span className="text-lg md:text-2xl font-bold text-text/40 -mt-5">:</span>
        <TimeUnit value={timeLeft.seconds} label="seg" />
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-2 py-1.5 md:px-4 md:py-2 min-w-[44px] md:min-w-[60px] text-center">
        <span className="text-lg md:text-3xl font-bold text-text">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] md:text-xs text-text/50 mt-1 font-medium">
        {label}
      </span>
    </div>
  )
}
