import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  :root {
    --primary-gradient: linear-gradient(135deg, #3498db 0%, #1a73e8 100%);
    --success-gradient: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    --warning-gradient: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    --danger-gradient: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    --header-gradient: linear-gradient(135deg, #2c3e50 0%, #1a3040 100%);
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --text-primary: #2c3e50;
    --text-secondary: #7f8c8d;
    --bg-light: #f5f7fa;
    --border-radius: 12px;
    --card-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    --transition-fast: all 0.2s ease;
    --transition-normal: all 0.3s ease;
  }
  
  body, h1, h2, h3, h4, p, ul, ol, li, figure, figcaption, blockquote, dl, dd {
    margin: 0;
  }
  
  body {
    min-height: 100vh;
    scroll-behavior: smooth;
    text-rendering: optimizeLegibility;
    line-height: 1.6;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    color: var(--text-primary);
    background-color: var(--bg-light);
    background-image: linear-gradient(to bottom, #f9fafc, #f5f7fa);
    transition: var(--transition-normal);
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 0.5em;
    color: var(--text-primary);
  }
  
  ul, ol {
    padding: 0;
  }
  
  body, input, button, textarea, select {
    font: inherit;
  }
  
  button {
    cursor: pointer;
    transition: var(--transition-fast);
  }
  
  img {
    max-width: 100%;
    display: block;
  }
  
  a {
    text-decoration: none;
    color: var(--primary-color);
    transition: var(--transition-fast);
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
    background: #c5d0e6;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #95a5a6;
  }
  
  /* Focus styling */
  :focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
  
  :focus:not(:focus-visible) {
    outline: none;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

export default GlobalStyles; 