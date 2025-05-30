import { Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import DashBoard from "./pages/dash_board/DashBoard"
import Layout from "./components/Layout"

function App() {
  
  return (
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>} />
          <Route path="/dashboard" element={<DashBoard/>} />
        </Route> 
      </Routes>
  )
}

export default App
