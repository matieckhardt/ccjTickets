import React, { useState } from 'react';
import { Table, Button, Notification } from '@mantine/core';
import axios from 'axios';
import SideBar from './sidebar';
import ComprasSwitch from './switch';

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
    dirAprobe: boolean;
  }[];
}

function FormDireccion(props: Props) {
  const [formValues, setFormValues] = useState<{ [key: number]: { dirAprobe: boolean | undefined } }>({});
  const [showNotification, setShowNotification] = useState(false);

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

  const filteredRows = props.usuarios.filter((element) => element.presupuesto !== undefined && element.dirAprobe === null);

  const rows = filteredRows.map((element) => (
    <tr key={element._id}>
      <td>{element.nivel}</td>
      <td>{element.solicitante}</td>
      <td>{element.tipoProblema}</td>
      <td>{element.dateTicket}</td>
      <td>{element.presupuesto}</td>
      <td>{element.descripSist}</td>
      <td>{element.estimFin}</td>
      <td>
        <ComprasSwitch onSwitchChange={(value) => handleAprobarChange(value, element._id)} />
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
  ));

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div style={{ marginTop: '60px', marginLeft: 0 }}>
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
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
          }}
        >
          <Notification onClose={() => setShowNotification(false)} color="teal">
            Los datos se modificaron correctamente.
          </Notification>
        </div>
      )}
    </div>
  );
}

export default FormDireccion;
