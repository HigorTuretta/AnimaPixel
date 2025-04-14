import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const PreviewContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: inline-block;
  margin: 1rem 0;
  padding: 1rem;
`

const Canvas = styled.canvas`
  display: block;
  background: transparent;
`

const AnimationPreview = ({ frames, fps, loop, pingPong }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const canvasRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!frames.length) return

    // Tamanho máximo do preview
    let maxW = 0
    let maxH = 0
    frames.forEach((f) => {
      if (f.canvas.width > maxW) maxW = f.canvas.width
      if (f.canvas.height > maxH) maxH = f.canvas.height
    })

    const canvas = canvasRef.current
    canvas.width = maxW
    canvas.height = maxH

    // Desenha o frame atual
    const drawFrame = (index) => {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const frameData = frames[index]
      if (!frameData) return
      const { canvas: frameCanvas, anchorX, anchorY } = frameData

      // anchor final => meio inferior
      const anchorFinalX = canvas.width / 2
      const anchorFinalY = canvas.height

      const dx = anchorFinalX - anchorX
      const dy = anchorFinalY - anchorY
      ctx.drawImage(frameCanvas, dx, dy)
    }

    drawFrame(currentIndex)

    const frameDelay = 1000 / fps
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        let next = prev + direction
        if (next >= frames.length) {
          if (pingPong) {
            next = frames.length - 2
            setDirection(-1)
          } else if (loop) {
            next = 0
          } else {
            next = frames.length - 1
          }
        } else if (next < 0) {
          if (pingPong) {
            next = 1
            setDirection(1)
          } else if (loop) {
            next = 0
          } else {
            next = 0
          }
        }
        return next
      })
    }, frameDelay)

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [frames, fps, loop, pingPong, direction, currentIndex])

  // Sempre que currentIndex mudar, redesenha
  useEffect(() => {
    if (!frames.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const frameData = frames[currentIndex]
    if (!frameData) return
    const { canvas: frameCanvas, anchorX, anchorY } = frameData

    const anchorFinalX = canvas.width / 2
    const anchorFinalY = canvas.height

    const dx = anchorFinalX - anchorX
    const dy = anchorFinalY - anchorY
    ctx.drawImage(frameCanvas, dx, dy)
  }, [currentIndex, frames])

  return (
    <PreviewContainer>
      <p>Prévia da Animação:</p>
      <Canvas ref={canvasRef} />
    </PreviewContainer>
  )
}

export default AnimationPreview
