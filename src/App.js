// App.js - CORRECT
import './App.css';
import NavBar from './components/frontOffice/Accuil/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Accuil from './components/frontOffice/Accuil/Accuil';
import RestoList from './components/frontOffice/ListDesResto/RestoList';
import DetailResto from './components/frontOffice/ListDesResto/DetailResto';
import Login from './components/frontOffice/Accuil/Login';
import SignUp from './components/frontOffice/Accuil/SignUp';
import Checkout from './components/frontOffice/ListDesResto/Checkout';
import HistCom from './components/frontOffice/Accuil/HistCom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<Accuil/>} />
          <Route path='/ListResto' element={<RestoList/>} />
          <Route path='/DetailResto/:id' element={<DetailResto/>} />
          <Route path='/Login' element={<Login/>} />
          <Route path='/register' element={<SignUp/>} />
          <Route path='/Checkout' element={<Checkout/>} />
          <Route path='/HistCom' element={<HistCom/>} />
        </Routes>
        
      </div>
    </BrowserRouter>
  );
}

export default App;