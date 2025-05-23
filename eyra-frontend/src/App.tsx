import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./App.css";
import "./styles/pageStyles.css";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
