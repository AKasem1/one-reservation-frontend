import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import NavBar from './components/NavBar';
import ReservationForm from './components/ReservationForm';
import Login from './components/Login';
import GradeTable from './components/GradeTable'
import { useAuthContext } from './hooks/useAuthContext';
import ClientTable from './components/ClientTable';
import UpdateGrade from './components/UpdateGrade';


function App() {
  const {admin} = useAuthContext()
  return (
    <div className='App'>
      <BrowserRouter>
      <NavBar />
      <div className='pages'>
        <Routes>
        <Route exact path='/' element={admin? <ReservationForm /> : <Login />}/>
        </Routes>
        <Routes>
        <Route path='/allGrades' element={admin? <GradeTable /> : <Login />}/>
        </Routes>
        <Routes>
        <Route path='/reservations' element={admin? <ClientTable /> : <Login />}/>
        </Routes>
        <Routes>
        <Route path='/updateGrade' element={admin? <UpdateGrade /> : <Login />}/>
        </Routes>
        <Routes>
        <Route exact path='/login' element={<Login />}/>
        </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
