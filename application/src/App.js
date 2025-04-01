import './App.css';
import Employes from './employes/employes';
import Materiel from './materiel/materiel';
import{BrowserRouter, Routes, Route, NavLink} from'react-router-dom';



function App() {

  return (
    
    <BrowserRouter>
      <nav>
        <NavLink to='/elements'>elements</NavLink>
        <NavLink to='/materiels'>materiel</NavLink>
      </nav>
     
      <Routes>
          <Route path='/employes' elemant={<Employes/>}>
              <Route index />
          </Route>
          
          <Route path='/materiels' element={<Materiel/>}/>
      </Routes>
    </BrowserRouter>
   
  );
}

export default App;

