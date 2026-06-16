import { Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import OpeningPage from "./pages/OpeningPage"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Analysis from "./pages/Analysis"
import Search from "./pages/Search"
import Reports from "./pages/Reports"
import Profile from "./pages/Profile"
function App(){

return(

<Routes>

<Route path="/" element={<OpeningPage />} />

<Route path="/home" element={<Home />} />

<Route path="/login" element={<Login />} />

<Route path="/analysis" element={<Analysis />} />

<Route path="/search" element={<Search />} />

<Route path="/reports" element={<Reports />} />

<Route path="/profile" element={<Profile />} />


<Route path="*" element={<Home />} />

</Routes>

)

}

export default App