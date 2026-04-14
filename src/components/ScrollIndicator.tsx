import { useState, useEffect } from 'react'

const sections = [
  { id: 'category-essential', label: 'Esenciales' },
  { id: 'category-optional', label: 'Opcionales' },
  { id: 'category-detail', label: 'Detalles' },
]

export function ScrollIndicator() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero')
      const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 600
      
      setIsVisible(window.scrollY > heroBottom - 100)

      let foundSection = -1
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.5) {
            foundSection = i
            break
          }
        }
      }
      if (foundSection >= 0) {
        setCurrentSection(foundSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = () => {
    if (currentSection >= sections.length - 1) {
      const hero = document.getElementById('hero')
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' })
        setCurrentSection(0)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      const nextSection = document.getElementById(sections[currentSection + 1].id)
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' })
        setCurrentSection(currentSection + 1)
      }
    }
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollTo}
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2 z-30
        flex items-center gap-2
        h-12 px-8 
        text-sm font-semibold 
        shadow-lg hover:shadow-xl
        btn-transition rounded-full
        animate-heartbeat
        bg-pastel-green text-white
        transition-all duration-200
      "
    >
      {currentSection >= sections.length - 1 ? (
        <span>↑ Subir</span>
      ) : (
        <span>Ver más ↓</span>
      )}
    </button>
  )
}