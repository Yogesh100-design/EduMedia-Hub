import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EduMediaLandingPro from './components/EduMediaLanding'
import Header from './components/Header'
import Footer from './components/Footer'
import Register from './components/Register'
import SignIn from './components/Signin'
import { Routes, Route } from "react-router-dom"
import Features from './components/Feutures'
import Pricing from './components/Pricing'
import Docs from './components/Doc'
import StudentDashboard from './components/studentLoginDashboard'
import Profile from './components/profile'
import TeacherPostCreator from './components/TeacherLoginDashboard'
import TeacherPost from './components/Teacher'
import HeroCursor from './components/Animated'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />

      {/* Routes control which page shows */}
      <Routes>
        <Route path="/" element={<EduMediaLandingPro />} />
        <Route path="/register" element={<Register />} />
        <Route path='/login' element={<SignIn/>} />
        <Route path='/feutures' element={<Features/>} />
        <Route path='/pricing' element={<Pricing/>} />
        <Route path='/Docs' element={<Docs/>} />
        <Route path='/student' element={<StudentDashboard/>} />
        <Route path='/teacher' element={<TeacherPost/>} />
        <Route path='/teacher-post' element={<TeacherPostCreator/>} />
        <Route path='/profile' element={<Profile/>} />
        {/* Add more routes here */}
      </Routes>

      <Footer />
    </>
  )
}

export default App
