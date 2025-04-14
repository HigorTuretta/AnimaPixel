import React, { useCallback } from 'react'
import styled from 'styled-components'

const DropzoneWrapper = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  padding: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  cursor: pointer;

  input[type="file"] {
    display: none;
  }
`

const Dropzone = ({ onFileSelected }) => {
  const handleFile = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0])
    }
  }, [onFileSelected])

  const handleClick = () => {
    document.getElementById('hidden-file-input').click()
  }

  return (
    <DropzoneWrapper onClick={handleClick}>
      <p>Arraste seu spritesheet aqui ou clique para selecionar</p>
      <input
        id="hidden-file-input"
        type="file"
        accept="image/*"
        onChange={handleFile}
      />
    </DropzoneWrapper>
  )
}

export default Dropzone
