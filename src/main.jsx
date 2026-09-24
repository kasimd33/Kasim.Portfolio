import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/fonts.css';
import PortfolioEntry from './components/PortfolioEntry';
import './styles/index.css';
import { prepareInitialPagePosition } from './lib/page-position';

const finishInitialPagePosition = prepareInitialPagePosition();

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><PortfolioEntry onReady={finishInitialPagePosition} /></React.StrictMode>);
