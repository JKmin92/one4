import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Toaster } from './components/ui/toaster';

function App() {

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App
