// App.js
import './App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/frontOffice/Accuil/NavBar';
import Accuil from './components/frontOffice/Accuil/Accuil';
import RestoList from './components/frontOffice/ListDesResto/RestoList';
import DetailResto from './components/frontOffice/ListDesResto/DetailResto';
import Login from './components/frontOffice/Accuil/Login';
import SignUp from './components/frontOffice/Accuil/SignUp';
import Checkout from './components/frontOffice/ListDesResto/Checkout';
import HistCom from './components/frontOffice/Accuil/HistCom';
import Dashboard from './components/backOffice/Dashboard';
import { restoreSession } from './redux/Actions/authActions';

import Overview from './components/backOffice/pages/Overview';
import Restaurants from './components/backOffice/pages/Restaurant';
import Dishes from './components/backOffice/pages/Dishes';
import Orders from './components/backOffice/pages/Orders';
import Users from './components/backOffice/pages/Users';
import Stats from './components/backOffice/pages/Stats';
import Settings from './components/backOffice/pages/Settings';

function AppContent() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Restore session when app loads
    dispatch(restoreSession());
  }, [dispatch]);
  
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Accuil/>} />
        <Route path='/ListResto' element={<RestoList/>} />
        <Route path='/DetailResto/:id' element={<DetailResto/>} />
        <Route path='/Login' element={<Login/>} />
        <Route path='/register' element={<SignUp/>} />
        <Route path='/Checkout' element={<Checkout/>} />
        <Route path='/HistCom' element={<HistCom/>} />

        <Route path='/Dashboard' element={<Dashboard/>}>
          <Route index element={<Overview/>} />
          <Route path='restaurants' element={<Restaurants/>} />
          <Route path='dishes' element={<Dishes/>} />
          <Route path='orders' element={<Orders/>} />
          <Route path='users' element={<Users/>} />
          <Route path='stats' element={<Stats/>} />
          <Route path='settings' element={<Settings/>} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;