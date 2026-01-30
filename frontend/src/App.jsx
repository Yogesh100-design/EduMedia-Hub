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
import InterviewQuestions from './components/InterviewQ'
import PlacementGuidance from './components/PlacementGuidance'
import Resources from './components/Resources'
import ResumeBuilder from './components/ResumeBuilder'
import MockTestSoftSkills from './components/MockTest'
import CareerBlogs from './components/CarrerBlog'
import BlogWriter from './components/CarrerBlogWrite'
import CompanyReview from './components/ComponyReview'
import SalaryInsights from './components/SalaryInsighs'
import AboutPage from './components/About'
import QandABoard from './components/Quetions'
import Chat from './components/Chat'


function App() {
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
        <Route path='/interview-questions' element={<InterviewQuestions/>} />
        <Route path='/placement-guidance' element={<PlacementGuidance/>} />
        <Route path='/resources' element={<Resources/>} />
        <Route path='/resume-builder' element={<ResumeBuilder/>} />
        <Route path='/mock-tests' element={<MockTestSoftSkills/>} />
        <Route path='/career-blogs' element={<CareerBlogs/>} />
        <Route path='/career-blogs-write' element={<BlogWriter/>} />
        <Route path='/company-reviews' element={<CompanyReview/>} />
        <Route path='/salary-insights' element={<SalaryInsights/>} />
        <Route path='/About' element={<AboutPage/>} />
        <Route path='/EduQ&A' element={<QandABoard/>} />
        <Route path='/chat' element={<Chat/>} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
