import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const FrameContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: #161b22;
  position: relative;
  width: 160px;
  height: 160px;
`

// Um ícone ou área para arrastar
const DragHandle = styled.div`
  width: 100%;
  height: 20px;
  background-color: #21262d;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: grab;

  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`

const CanvasWrapper = styled.div`
  /* resto do espaço fica para o canvas */
  width: 100%;
  height: calc(100% - 20px);
  cursor: crosshair;
  position: relative;
`

export default function SortableFrame({ id, frameData, onAnchorChange }) {
  const { canvas, anchorX, anchorY } = frameData

  // useSortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  const canvasRef = useRef(null)

  // Desenha preview + âncora no canvas
  useEffect(() => {
    if (!canvas || !canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, 128, 128)

    const scaleX = 128 / canvas.width
    const scaleY = 128 / canvas.height
    const scale = Math.min(scaleX, scaleY)
    const offsetX = (128 - (canvas.width * scale)) / 2
    const offsetY = (128 - (canvas.height * scale)) / 2

    // Desenha sprite
    ctx.drawImage(
      canvas,
      0, 0, canvas.width, canvas.height,
      offsetX, offsetY,
      canvas.width * scale,
      canvas.height * scale
    )

    // Desenha o "x" da âncora
    const anchorPreviewX = offsetX + anchorX * scale
    const anchorPreviewY = offsetY + anchorY * scale
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    ctx.moveTo(anchorPreviewX - 5, anchorPreviewY)
    ctx.lineTo(anchorPreviewX + 5, anchorPreviewY)
    ctx.moveTo(anchorPreviewX, anchorPreviewY - 5)
    ctx.lineTo(anchorPreviewX, anchorPreviewY + 5)
    ctx.stroke()
  }, [canvas, anchorX, anchorY])

  // Clique para mudar âncora
  const handleCanvasClick = (e) => {
    if (!canvasRef.current || !canvas) return

    const rect = canvasRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Mesmo cálculo de offset/scale
    const scaleX = 128 / canvas.width
    const scaleY = 128 / canvas.height
    const scale = Math.min(scaleX, scaleY)
    const offsetX = (128 - (canvas.width * scale)) / 2
    const offsetY = (128 - (canvas.height * scale)) / 2

    const realX = (clickX - offsetX) / scale
    const realY = (clickY - offsetY) / scale

    if (realX >= 0 && realX <= canvas.width && realY >= 0 && realY <= canvas.height) {
      onAnchorChange(realX, realY)
    }
  }

  return (
    <div ref={setNodeRef} style={style}>
      {/* Usamos um "handle" para drag */}
      <DragHandle {...attributes} {...listeners}>
        Arraste
      </DragHandle>

      {/* Canvas fica livre de drag, para poder clicar */}
      <FrameContainer>
        <CanvasWrapper onClick={handleCanvasClick}>
          <canvas
            ref={canvasRef}
            width={128}
            height={128}
          />
        </CanvasWrapper>
      </FrameContainer>
    </div>
  )
}
