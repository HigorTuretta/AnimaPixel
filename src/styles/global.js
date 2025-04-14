import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: #0d1117; /* fundo dark estilo GitHub */
    color: #c9d1d9;            /* texto padrão GitHub Dark */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  button {
    cursor: pointer;
    background-color: #21262d;
    color: #c9d1d9;
    border: 1px solid #30363d;
    padding: 8px 12px;
    border-radius: 4px;
    margin-right: 8px;
  }

  button:hover {
    background-color: #30363d;
  }

  input, select {
    background-color: #21262d;
    color: #c9d1d9;
    border: 1px solid #30363d;
    border-radius: 4px;
    padding: 4px 8px;
  }
`
