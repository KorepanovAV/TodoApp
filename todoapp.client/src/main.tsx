import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api';

import 'primereact/resources/themes/viva-light/theme.css';
import 'primeicons/primeicons.css'

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PrimeReactProvider value={{ unstyled: false }}>
            <App />
        </PrimeReactProvider>
    </React.StrictMode>
)
