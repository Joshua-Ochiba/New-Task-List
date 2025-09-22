import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import {ConvexProvider, ConvexReactClient} from 'convex/react'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL) 

// Import your Publishable Key


createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ConvexProvider client={convex}>
          <App/> 
        </ConvexProvider>
      </ClerkProvider>
    </StrictMode>,
)
