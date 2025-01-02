import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Editor from './components/Editor/Editor';
import Navbar from './components/Navbar/Navbar';
import Questions from './components/Questions/Questions';
import Content from './components/Questions/Content';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Profile from './components/MyProfile/Profile/Profile';
import UserQuestionContent from './components/MyProfile/Profile/Content';
import Admin from './components/Admin/user';
import MyQuestions from './components/MyProfile/MyQuestions/MyQuestions';
import UpdateQuestion from './components/MyProfile/MyQuestions/UpdateQuestion';
import MyAnswers from './components/MyProfile/MyAnswers/MyAnswers';
import MyTags from './components/MyProfile/MyTags/MyTags';
import Tags from './components/Tags/Tags';
import QuestionOnTags from './components/Tags/QuestionOnTags';
import Search from './components/Questions/Search';
import AdminUser from './components/Admin/user';
import AdminQuestions from './components/Admin/Adminquestion';
import AdminHome from './components/Admin/AdminHome';
import Adminanswer from './components/Admin/AdminAnswer';
import ProtectedRouteAdmin from './components/Admin/ProtectedRouteAdmin';

function App() {
  const userType = localStorage.getItem("Usertype");
  const isAdmin = userType === "admin";
  console.log(isAdmin);

  return (
    <div>
     <BrowserRouter>
      <Navbar />
      <Routes>

        <Route path = "/" element = {<Questions/>}/>
     
        <Route path = "/editor" element = {<Editor/>}/>
        <Route path = "/login" element = {<Login/>}/>
        <Route path = "/register" element = {<Register/>}/>
        <Route path="/questions" element = {<Questions />}></Route>
        <Route path="/question/:type" element = {<Content />}></Route>
        <Route path="/answer/:type" element = {<UserQuestionContent />}></Route>
       
       {/* profile routes */}
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/myquestions' element={<MyQuestions />}></Route>
        <Route path='/updateque/:type' element = {<UpdateQuestion/>}/>
        <Route path='/myanswers' element={<MyAnswers />}></Route>
        <Route path="/mytags" element={<MyTags />}></Route>
        
        {/* admin routes  */}
        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/adminHome" element={<AdminHome />} />
          <Route path="/adminuser" element={<AdminUser />} />
          <Route path="/adminquestions" element={<AdminQuestions />} />
          <Route path="/adminanswer" element={<Adminanswer />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        {}

        {/* tags routers */}
        <Route path='/tags' element= {<Tags />}></Route>
        <Route path = '/questionOntags/:type' element = {<QuestionOnTags/>}></Route>

        {/* Search Question */}
        <Route path = "/search" element={<Search/>}></Route>
        
        
      </Routes>
      {}
     </BrowserRouter>
    </div>
  );
}

export default App;