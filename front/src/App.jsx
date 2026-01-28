import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './utils/AuthProvider';

function App() {

  return (
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
