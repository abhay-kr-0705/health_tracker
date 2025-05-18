import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  body, h1, h2, h3, h4, p, ul, ol, li, figure, figcaption, blockquote, dl, dd {
    margin: 0;
  }
  
  body {
    min-height: 100vh;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
    line-height: 1.6;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    color: #2c3e50;
    background-color: #f5f7fa;
    transition: all 0.3s ease;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 0.5em;
  }
  
  ul, ol {
    padding: 0;
  }
  
  body, input, button, textarea, select {
    font: inherit;
  }
  
  button {
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  img {
    max-width: 100%;
    display: block;
  }
  
  a {
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #b8c2cc;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #95a5a6;
  }
  
  /* Focus styling */
  :focus {
    outline: 2px solid #3498db;
    outline-offset: 2px;
  }
  
  :focus:not(:focus-visible) {
    outline: none;
  }
`;

export default GlobalStyles; 