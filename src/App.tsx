import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import DashBoard from "./pages/dash_board/DashBoard";
import Layout from "./components/Layout";
import InsertConferenceInfo from "./pages/inerst_conference_info/InsertConferenceInfo";
import Result from "./pages/result/Result";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/insert_info" element={<InsertConferenceInfo />} />
        <Route path="/result" element={<Result />} />
      </Route>
    </Routes>
  );
}

export default App;
