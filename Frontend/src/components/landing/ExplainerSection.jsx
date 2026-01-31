'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../../style/explainer-section.css'

gsap.registerPlugin(ScrollTrigger)

const TEXT =
  'TRACE analyzes your documents and shows exactly where each answer comes from.'

const ExplainerSection = () => {
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const el = textRef.current
    const length = TEXT.length

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { '--idx': 0 },
        {
          '--idx': length,
          ease: `steps(${length})`,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="explainer-section">
      <p
        ref={textRef}
        className="type-on-scroll"
        style={{ '--text-length': TEXT.length }}
      >
        <span>{TEXT}</span>
      </p>

      <p className="subtext">
        No hallucinations. No black boxes.
      </p>
    </section>
  )
}

export default ExplainerSection
