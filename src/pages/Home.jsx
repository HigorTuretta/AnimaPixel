import React, { useState } from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import GIF from 'gif.js.optimized'

import Dropzone from '../components/Dropzone'
import FramesList from '../components/FrameList'
import AnimationControls from '../components/AnimationControls'
import AnimationPreview from '../components/AnimationPreview'
import SpriteSheetConfig from '../components/SpriteSheetConfig'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`

const ImagePreview = styled.img`
  max-width: 400px;
  display: block;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin: 1rem 0;
`

// Barra de progresso
const ProgressBarContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 8px;
  background-color: #30363d;
  margin: 1rem 0;
  border-radius: 4px;
  overflow: hidden;
`

const ProgressBarFill = styled.div`
  width: ${props => props.percent}%;
  background-color: #58a6ff;
  height: 100%;
  transition: width 0.2s ease;
`

const Home = () => {
  const [imageSrc, setImageSrc] = useState(null)
  // frames = [{ canvas, anchorX, anchorY }, ...]
  const [frames, setFrames] = useState([])

  // Config de recorte
  const [columns, setColumns] = useState(1)
  const [rows, setRows] = useState(1)
  const [totalFrames, setTotalFrames] = useState(1)

  // Controles de animação
  const [fps, setFps] = useState(8)
  const [loop, setLoop] = useState(true)
  const [pingPong, setPingPong] = useState(false)

  // Progresso do GIF
  const [gifProgress, setGifProgress] = useState(null)

  // Upload da imagem
  const handleImageUpload = (file) => {
    if (!file) return
    toast.info('Carregando imagem...')

    const reader = new FileReader()
    reader.onload = (e) => {
      setImageSrc(e.target.result)
      toast.success('Imagem carregada!')
    }
    reader.readAsDataURL(file)
  }

  // Gera frames com base em col/rows/total
  const handleGenerateFrames = () => {
    if (!imageSrc) {
      toast.error('Nenhuma imagem para recortar!')
      return
    }
    if (columns < 1 || rows < 1 || totalFrames < 1) {
      toast.error('Configurações de recorte inválidas!')
      return
    }

    toast.info('Gerando frames...')

    const img = new Image()
    img.onload = () => {
      const frameWidth = img.width / columns
      const frameHeight = img.height / rows

      const newFrames = []
      let frameCount = 0

      const tempCanvas = document.createElement('canvas')
      const ctx = tempCanvas.getContext('2d')

      outer:
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          if (frameCount >= totalFrames) break outer

          tempCanvas.width = frameWidth
          tempCanvas.height = frameHeight
          ctx.clearRect(0, 0, frameWidth, frameHeight)
          ctx.drawImage(
            img,
            c * frameWidth,
            r * frameHeight,
            frameWidth,
            frameHeight,
            0,
            0,
            frameWidth,
            frameHeight
          )

          // Cria canvas final
          const frameCanvas = document.createElement('canvas')
          frameCanvas.width = frameWidth
          frameCanvas.height = frameHeight
          frameCanvas.getContext('2d').drawImage(tempCanvas, 0, 0)

          newFrames.push({
            canvas: frameCanvas,
            anchorX: frameWidth / 2, // âncora padrão no meio inferior
            anchorY: frameHeight
          })

          frameCount++
        }
      }

      setFrames(newFrames)
      if (newFrames.length) {
        toast.success(`Gerados ${newFrames.length} frames!`)
      } else {
        toast.error('Nenhum frame gerado.')
      }
    }
    img.src = imageSrc
  }

  // Exportar JSON
  const handleExportJSON = () => {
    if (!frames.length) {
      toast.error('Nenhum frame para exportar!')
      return
    }
    toast.info('Exportando JSON...')

    const w = frames[0].canvas.width
    const h = frames[0].canvas.height

    const lottieLike = {
      v: '5.7.4',
      fr: fps,
      ip: 0,
      op: frames.length,
      w,
      h,
      nm: 'My Pixel Animation',
      assets: frames.map((f, i) => ({
        id: `image_${i}`,
        w: f.canvas.width,
        h: f.canvas.height,
        p: f.canvas.toDataURL(),
        e: 1,
        anchor: { x: f.anchorX, y: f.anchorY }
      })),
      layers: frames.map((_, i) => ({
        ty: 'image',
        refId: `image_${i}`
      }))
    }

    const dataStr = JSON.stringify(lottieLike, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'my-animation.json'
    link.click()
    URL.revokeObjectURL(url)

    toast.success('JSON exportado!')
  }

  // Exportar GIF (com barra de progresso)
  const handleExportGIF = () => {
    if (!frames.length) {
      toast.error('Nenhum frame para exportar!')
      return
    }
    toast.info('Gerando GIF... aguarde...')

    // Inicia barra de progresso
    setGifProgress(0)

    const gif = new GIF({
      workers: 2,
      quality: 10
    })

    // Monta array considerando ping-pong
    let framesToUse = [...frames]
    if (pingPong && frames.length > 1) {
      const reversed = frames.slice().reverse().slice(1, -1)
      framesToUse = framesToUse.concat(reversed)
    }

    // Descobre maior width/height
    let finalW = 0
    let finalH = 0
    framesToUse.forEach((f) => {
      if (f.canvas.width > finalW) finalW = f.canvas.width
      if (f.canvas.height > finalH) finalH = f.canvas.height
    })

    // Monta e adiciona frames no gif
    framesToUse.forEach((f) => {
      const outCanvas = document.createElement('canvas')
      outCanvas.width = finalW
      outCanvas.height = finalH

      const ox = f.anchorX
      const oy = f.anchorY

      // Posição final do anchor (centro inferior)
      const anchorFinalX = finalW / 2
      const anchorFinalY = finalH

      const dx = anchorFinalX - ox
      const dy = anchorFinalY - oy

      outCanvas.getContext('2d').drawImage(f.canvas, dx, dy)
      gif.addFrame(outCanvas, { delay: 1000 / fps })
    })

    gif.on('progress', (p) => {
      // p é um número de 0 a 1
      setGifProgress(Math.floor(p * 100))
    })

    gif.on('finished', (blob) => {
      const url = URL.createObjectURL(blob)

      // Forçar download
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'my-animation.gif'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Finaliza barra de progresso
      setGifProgress(null)

      toast.success('GIF exportado com sucesso!')
    })

    gif.render()
  }

  return (
    <Container>
      <h1>Pixel Art Animation Editor</h1>
      <Dropzone onFileSelected={handleImageUpload} />

      {imageSrc && (
        <>
          <p>Prévia da imagem:</p>
          <ImagePreview src={imageSrc} alt="Sprite Sheet Preview" />
        </>
      )}

      <SpriteSheetConfig
        columns={columns}
        setColumns={setColumns}
        rows={rows}
        setRows={setRows}
        totalFrames={totalFrames}
        setTotalFrames={setTotalFrames}
        onGenerateFrames={handleGenerateFrames}
      />

      {frames.length > 0 && (
        <>
          <p>Frames ({frames.length}) – clique para âncora, arraste para reordenar:</p>
          <FramesList frames={frames} setFrames={setFrames} />

          <AnimationControls
            fps={fps}
            setFps={setFps}
            loop={loop}
            setLoop={setLoop}
            pingPong={pingPong}
            setPingPong={setPingPong}
          />

          <AnimationPreview
            frames={frames}
            fps={fps}
            loop={loop}
            pingPong={pingPong}
          />

          {/* Barra de progresso do GIF */}
          {gifProgress !== null && (
            <ProgressBarContainer>
              <ProgressBarFill percent={gifProgress} />
            </ProgressBarContainer>
          )}

          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleExportJSON}>Exportar JSON</button>
            <button onClick={handleExportGIF}>Exportar GIF</button>
          </div>
        </>
      )}
    </Container>
  )
}

export default Home
