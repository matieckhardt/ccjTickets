import React, { useState } from 'react';
import { Table, NumberInput, Button, Notification } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import axios from 'axios';
import SideBar from './sidebar';

interface Props {
  usuarios: {
    _id: number;
    nivel: string;
    solicitante: string;
    tipoProblema: string;
    dateTicket: string;
    descripSist: string;
    compras: boolean;
    dateSolved: string;
    presupuesto: number;
  }[];
}

function FormAdministracion(props: Props) {
  const [formValues, setFormValues] = useState<{ [key: number]: { dateCompras: Date | null; presupuesto: number | undefined } }>({});
  const [showNotification, setShowNotification] = useState(false);

  const handleDateChange = (value: Date | null, userId: number) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [userId]: {
        ...prevFormValues[userId],
        dateCompras: value,
      },
    }));
  };

  const handlePresupuestoChange = (value: number | undefined, userId: number) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [userId]: {
        ...prevFormValues[userId],
        presupuesto: value,
      },
    }));
  };

  const handleSubmit = (userId: number) => {
    const user = props.usuarios.find((element) => element._id === userId);
    const currentUserFormValues = formValues[userId];

    if (currentUserFormValues && currentUserFormValues.dateCompras && currentUserFormValues.presupuesto) {
      const updatedUser = {
        ...user,
        dateCompras: currentUserFormValues.dateCompras.toISOString(),
        presupuesto: currentUserFormValues.presupuesto,
      };

      axios
        .put(
          `https://colegiociudadjardin.edu.ar/ticketUpdate?_id=${user?._id}&dateCompras=${updatedUser.dateCompras}&presupuesto=${updatedUser.presupuesto}`
        )
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

  const rows = props.usuarios
    .filter((element) => element.compras && element.dateSolved !== undefined && element.presupuesto === undefined)
    .map((element) => (
      <tr key={element._id}>
        <td>{element.nivel}</td>
        <td>{element.solicitante}</td>
        <td>{element.tipoProblema}</td>
        <td>{element.descripSist}</td>
        <td>{element.dateTicket}</td>
        <td>
          <DatePickerInput
            required
            value={formValues[element._id]?.dateCompras}
            onChange={(value) => handleDateChange(value, element._id)}
          />
        </td>
        <td>
          <NumberInput
            required
            value={formValues[element._id]?.presupuesto}
            onChange={(value) => handlePresupuestoChange(parseInt(value as string) || undefined, element._id)}
            type="number"
          />
        </td>
        <td>
          <Button
            radius="md"
            size="md"
            onClick={() => handleSubmit(element._id)}
            disabled={!formValues[element._id]?.dateCompras || !formValues[element._id]?.presupuesto}
          >
            Enviar
          </Button>
        </td>
      </tr>
    ));

  return (
    <>
      <div style={{ display: 'flex' }}>
        <SideBar />
        <div style={{ marginTop: '60px', marginLeft: 0 }}>
          <Table>
            <thead>
              <tr>
                <th>Tipo de usuario</th>
                <th>Nombre</th>
                <th>Problema</th>
                <th>Descripcion</th>
                <th>Fecha</th>
                <th>Fecha de arribo</th>
                <th>Monto del presupuesto</th>
                <th>¿Desea guardar?</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
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

    </>
  );
}

export default FormAdministracion;
