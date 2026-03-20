import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Feed from "./pages/Feed";
import Explore from "./pages/Explore";
import { Message } from "./pages/Message";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" />}/>
        <Route path="/feed" element={<Feed/>}/>
        <Route path="/explore" element={<Explore/>}/>
        <Route path="/message" element={<Message/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/saved" element={<Saved/>}/> 
      </Routes>
    </Layout>
  );
}

export default App;
