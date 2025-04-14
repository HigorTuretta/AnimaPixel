import React from 'react'
import styled from 'styled-components'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import SortableFrame from './SortableFrame.jsx'

const ListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const FramesList = ({ frames, setFrames }) => {

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return
    if (active.id !== over.id) {
      const oldIndex = frames.findIndex((_, i) => i === active.id)
      const newIndex = frames.findIndex((_, i) => i === over.id)
      setFrames((prev) => {
        const reordered = arrayMove(prev, oldIndex, newIndex)
        return [...reordered]
      })
    }
  }

  // Atualiza a âncora de um frame específico
  const updateAnchor = (frameIndex, x, y) => {
    setFrames((prev) => {
      const copy = [...prev]
      copy[frameIndex] = {
        ...copy[frameIndex],
        anchorX: x,
        anchorY: y
      }
      return copy
    })
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={frames.map((_, i) => i)} strategy={horizontalListSortingStrategy}>
        <ListWrapper>
          {frames.map((frameData, i) => (
            <SortableFrame
              key={i}
              id={i}
              frameData={frameData}
              onAnchorChange={(x, y) => updateAnchor(i, x, y)}
            />
          ))}
        </ListWrapper>
      </SortableContext>
    </DndContext>
  )
}

export default FramesList
