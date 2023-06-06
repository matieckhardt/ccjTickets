import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './index.css';
import reportWebVitals from './reportWebVitals';
import FormDocentes from './components/FormDocentes';
import FormAdministracion from './components/FormAdministracion';
import FormSistemas from './components/FormSistemas';
import FormDireccion from './components/FormDireccion';
import VistaTickets from './components/vistaTickets';

const App = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    
    fetch('https://colegiociudadjardin.edu.ar/tickets') 
      .then(response => response.json())
      .then(data => setUsuarios(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<FormDocentes
            selectLabel="Que clase de problema tenes?"
            selectPlaceholder="Elegi una opcion"
            textInputLabel="Descripcion del Problema"
            textInputPlaceholder="No funciona la red"
            datePickerLabel="Plazo maximo de solucion"
            datePickerPlaceholder="Para cuando necesitas arreglar el problema?"
            userName="Carlos"
            userType="Docente"
            usuarios={usuarios} 
          />} />
          <Route path="/administracion" element={<FormAdministracion usuarios={usuarios} />} />
          <Route path="/sistemas" element={<FormSistemas usuarios={usuarios} />} />
          <Route path="/tickets" element={<VistaTickets usuarios={usuarios} />} />
          <Route path="/direccion" element={<FormDireccion usuarios={usuarios} />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
reportWebVitals();
