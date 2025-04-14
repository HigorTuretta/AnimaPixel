import React from 'react'
import { ThemeProvider } from 'styled-components'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { GlobalStyle } from './styles/global.js'
import { theme } from './styles/Theme.js'
import Home from './pages/Home.jsx'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ToastContainer />
      <Home />
    </ThemeProvider>
  )
}

export default App
