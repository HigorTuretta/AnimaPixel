import React from 'react'
import styled from 'styled-components'

const ControlsWrapper = styled.div`
  margin: 1rem 0;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`

const AnimationControls = ({ fps, setFps, loop, setLoop, pingPong, setPingPong }) => {
  return (
    <ControlsWrapper>
      <label>
        FPS:
        <input
          type="number"
          value={fps}
          onChange={(e) => setFps(Number(e.target.value))}
          style={{ width: '60px', marginLeft: '0.5rem' }}
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={loop}
          onChange={(e) => setLoop(e.target.checked)}
        />
        Loop
      </label>

      <label>
        <input
          type="checkbox"
          checked={pingPong}
          onChange={(e) => setPingPong(e.target.checked)}
        />
        PingPong
      </label>
    </ControlsWrapper>
  )
}

export default AnimationControls
