import React, { useState, useEffect } from 'react';
import { Table, Button, Notification } from '@mantine/core';
import axios from 'axios';
import SideBar from './sidebar';
interface Props {
  usuarios: {
    _id: number;
    nivel: string;
    solicitante: string;
    tipoProblema: string;
    dateTicket: string;
    presupuesto: number;
    estimFin: string;
    descripSist: string;
    descripUser: string;
    compras: boolean;
  }[];
}

function FormDireccion(props: Props) {
  const [formValues, setFormValues] = useState<{ [key: number]: { dirAprobe: boolean | undefined } }>({});
  const [submittedRows, setSubmittedRows] = useState<Set<number>>(new Set());
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Cargar filas enviadas desde el almacenamiento local al iniciar la página
    const submittedRowsFromStorage = localStorage.getItem('submittedRowsDireccion');
    if (submittedRowsFromStorage) {
      setSubmittedRows(new Set(JSON.parse(submittedRowsFromStorage)));
    }
  }, []);

  useEffect(() => {
    // Guardar filas enviadas en el almacenamiento local al cambiar el estado
    localStorage.setItem('submittedRowsDireccion', JSON.stringify(Array.from(submittedRows)));
  }, [submittedRows]);

  const handleAprobarChange = (value: boolean | undefined, userId: number) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [userId]: {
        ...prevFormValues[userId],
        dirAprobe: value,
      },
    }));
  };

  const handleSubmit = (userId: number) => {
    const currentUserFormValues = formValues[userId];

    if (currentUserFormValues && currentUserFormValues.dirAprobe !== undefined) {
      axios
        .put(`https://colegiociudadjardin.edu.ar/ticketUpdate?_id=${userId}&dirAprobe=${currentUserFormValues.dirAprobe}`)
        .then((response) => {
          console.log(response.data);
          setShowNotification(true);
          setSubmittedRows((prevSubmittedRows) => new Set(prevSubmittedRows).add(userId));
          setFormValues((prevFormValues) => {
            const updatedFormValues = { ...prevFormValues };
            delete updatedFormValues[userId];
            return updatedFormValues;
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const filteredRows = props.usuarios.filter(
    (element) => !submittedRows.has(element._id) && element.presupuesto !== undefined
  );

  const rows = filteredRows.map((element) => {
    if (submittedRows.has(element._id)) {
      return null; // Omitir las filas ya enviadas
    }

    return (
      <tr key={element._id}>
        <td>{element.nivel}</td>
        <td>{element.solicitante}</td>
        <td>{element.tipoProblema}</td>
        <td>{element.dateTicket}</td>
        <td>{element.presupuesto}</td>
        <td>{element.descripSist}</td>
        <td>{element.estimFin}</td>
        <td>
          <Button
            radius="md"
            size="md"
            onClick={() => handleAprobarChange(true, element._id)}
            variant={formValues[element._id]?.dirAprobe ? 'filled' : 'outline'}
          >
            Sí
          </Button>
          <Button
            radius="md"
            size="md"
            onClick={() => handleAprobarChange(false, element._id)}
            variant={!formValues[element._id]?.dirAprobe ? 'filled' : 'outline'}
          >
            No
          </Button>
        </td>
        <td>
          <Button
            radius="md"
            size="md"
            onClick={() => handleSubmit(element._id)}
            disabled={formValues[element._id]?.dirAprobe === undefined}
          >
            Enviar
          </Button>
        </td>
      </tr>
    );
  });

  return (

    <>
    <div style={{
        display:'flex',
        

        }}>
        
        

        


        <SideBar/>

        
        
        

    
        <div style={{marginTop:'60px', marginLeft:0}}>

    
      <Table>
        <thead>
          <tr>
            <th>Tipo de usuario</th>
            <th>Nombre</th>
            <th>Problema</th>
            <th>Fecha de arribo</th>
            <th>Presupuesto</th>
            <th>Descripción Sistemas</th>
            <th>Fecha estimada de resolución</th>
            <th>Aprobar</th>
            <th>Desea guardar?</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
        </div>
      {showNotification && (
        <Notification onClose={handleNotificationClose} color="teal">
          Los datos se modificaron correctamente.
        </Notification>
      )}
      </div>
    </>
  );
}

export default FormDireccion;
