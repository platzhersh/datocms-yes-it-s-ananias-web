import styled, { keyframes } from 'styled-components'

const fade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const FadeIn = styled.div`
  animation: ${fade} 500ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const STAGGER_STEP_MS = 80
const STAGGER_MAX = 24

const staggerRules = (() => {
  let rules = ''
  for (let i = 0; i < STAGGER_MAX; i++) {
    rules += `& > *:nth-child(${i + 1}) { animation-delay: ${i * STAGGER_STEP_MS}ms; }\n`
  }
  return rules
})()

export const FadeInStagger = styled.div`
  & > * {
    animation: ${slideUp} 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  ${staggerRules}

  @media (prefers-reduced-motion: reduce) {
    & > * {
      animation: none;
    }
  }
`
