import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from "./routes/Routes.jsx"
import { RouterProvider } from 'react-router-dom'
import { queryClient } from './utils/queryClient.jsx'
import { QueryClientProvider } from '@tanstack/react-query'
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
createRoot(document.getElementById('root')).render(

  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
