import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./App.css";
import "./styles/pageStyles.css";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
