import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store.js'
import { BrowserRouter as Router } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <Toaster />
        <Router>
            <ErrorBoundary>
            <App />
            </ErrorBoundary>
            
        </Router>
        </PersistGate>
    </Provider>
  </StrictMode>,
)
