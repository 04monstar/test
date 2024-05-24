import React from 'react'
import Register from './credRoutes/Signup/Register'
import Otp from './credRoutes/otp/Otp'
import {Routes,Route} from 'react-router-dom'
import Login from './credRoutes/login/Login'
import Home from './pages/home'
import EnterRoom from './Room/Enter/EnterRoom'
import CreateRoom from './Room/Create/CreateRoom'
import ChatBox from './Room/Roominside/Room'
// import CodeBox from './Room/codebox/Codebox' //for code box use




const App = () => {
  return (
    <div>
    <Routes>
    <Route path='/' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/register/otp' element={<Otp />} />
    <Route path='/home' element={<Home />} />
    <Route path='/createRoom' element={<CreateRoom />} />
    <Route path='/enterRoom' element={<EnterRoom />} />
    <Route path='/room/:roomId/:username' element={<ChatBox />} />
    </Routes>
    </div>
  )
}

export default App
