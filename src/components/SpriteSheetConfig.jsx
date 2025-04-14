import React from 'react'
import styled from 'styled-components'

const ConfigWrapper = styled.div`
  margin: 1rem 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`

const SpriteSheetConfig = ({
  columns, setColumns,
  rows, setRows,
  totalFrames, setTotalFrames,
  onGenerateFrames
}) => {
  return (
    <ConfigWrapper>
      <div>
        <label>Colunas:</label>
        <input
          type="number"
          min="1"
          value={columns}
          onChange={(e) => setColumns(Number(e.target.value))}
          style={{ width: '60px', marginLeft: '0.5rem' }}
        />
      </div>
      <div>
        <label>Linhas:</label>
        <input
          type="number"
          min="1"
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
          style={{ width: '60px', marginLeft: '0.5rem' }}
        />
      </div>
      <div>
        <label>Total de Frames:</label>
        <input
          type="number"
          min="1"
          value={totalFrames}
          onChange={(e) => setTotalFrames(Number(e.target.value))}
          style={{ width: '60px', marginLeft: '0.5rem' }}
        />
      </div>
      <button onClick={onGenerateFrames}>Gerar Frames</button>
    </ConfigWrapper>
  )
}

export default SpriteSheetConfig
