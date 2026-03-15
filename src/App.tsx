  import { BrowserRouter } from 'react-router-dom'
  import { AuthProvider } from './context/AuthContext'
  import AppRoutes from './routes/AppRoutes'
  import './App.css'
  import { WishlistProvider } from './context/WishlistContext'  // ← add this


  function App() {
    return (
      <BrowserRouter>
        <AuthProvider>
              <WishlistProvider>

          <AppRoutes />
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    )
  }

  export default App
