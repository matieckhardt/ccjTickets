import React, { useState, useEffect } from 'react';
import { Table, Button, TextInput, Notification } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import axios from 'axios';
import ComprasSwitch from './switch';
import SideBar from './sidebar';

interface Props {
  usuarios: {
    _id: number;
    nivel: string;
    solicitante: string;
    tipoProblema: string;
    dateTicket: string;
    presupuesto: number;
    descripUser: string;
    descripSist: string;
    dirAprobe: boolean;
    dateSolved: Date;
    estimFin: Date;
    requiereCompras: string;
    dateCompras: string;
  }[];
}

function FormSistemas(props: Props) {
  const [formValues, setFormValues] = useState<{
    [key: number]: {
      requiereCompras: boolean;
      estimFin: Date | null;
      descripSist: string;
      dateSolved: Date | null;
    };
  }>({});
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const initialFormValues = props.usuarios.reduce((acc, user) => {
      return {
        ...acc,
        [user._id]: {
          requiereCompras: false,
          estimFin: null,
          descripSist: '',
          dateSolved: null,
        },
      };
    }, {});
    setFormValues(initialFormValues);
  }, [props.usuarios]);

  const handleRequiereComprasChange = (value: boolean, userId: number) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [userId]: {
        ...prevFormValues[userId],
        requiereCompras: value,
      },
    }));
  };

  const handleEstimFinChange = (value: Date | null, userId: number) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [userId]: {
        ...prevFormValues[userId],
        estimFin: value,
      },
    }));
  };

  const handleDescripSistChange = (value: string, userId: number) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [userId]: {
        ...prevFormValues[userId],
        descripSist: value,
      },
    }));
  };

  const handleDateSolvedChange = (value: Date | null, userId: number) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [userId]: {
        ...prevFormValues[userId],
        dateSolved: value,
      },
    }));
  };

  const handleSubmit = (userId: number) => {
    const user = props.usuarios.find((element) => element._id === userId);
    const currentUserFormValues = formValues[userId];
    if (
      currentUserFormValues &&
      currentUserFormValues.estimFin &&
      currentUserFormValues.descripSist
    ) {
      const updatedUser = {
        ...user,
        requiereCompras: formValues[userId]?.requiereCompras || false,
        estimFin: currentUserFormValues.estimFin,
        descripSist: currentUserFormValues.descripSist || '',
        dateSolved: currentUserFormValues.dateSolved,
      };

      axios
        .put(
          `https://colegiociudadjardin.edu.ar/ticketUpdate?_id=${user?._id}&compras=${updatedUser.requiereCompras}&estimFin=${updatedUser.estimFin}&descripSist=${updatedUser.descripSist}&dateSolved=${updatedUser.dateSolved}`
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

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const rows = props.usuarios.map((element) => {
    const initialValues = formValues[element._id];

    return (
      <tr key={element._id}>
        <td>{element.nivel}</td>
        <td>{element.solicitante}</td>
        <td>{element.tipoProblema}</td>
        <td>{element.descripUser}</td>
        <td>{element.dateTicket}</td>
        <td>
          <TextInput
            required
            defaultValue={element.descripSist}
            onChange={(event) =>
              handleDescripSistChange(event.currentTarget.value, element._id)
            }
          />
        </td>
        <td>
          <ComprasSwitch
            onSwitchChange={(value) =>
              handleRequiereComprasChange(value, element._id)
            }
          />
        </td>
        <td>{element.dateCompras}</td>
        <td>{element.presupuesto}</td>
        <td>
          <DatePickerInput
            required
            date={element.estimFin}
            onChange={(value) => handleEstimFinChange(value, element._id)}
          />
        </td>
        <td>
          <DatePickerInput
            required
            date={element.dateSolved}
            onChange={(value) => handleDateSolvedChange(value, element._id)}
          />
        </td>
        <td style={{ color: element.dirAprobe ? 'green' : 'red' }}>
          {element.dirAprobe ? 'Aprobado' : 'No Aprobado'}
        </td>
        <td>
          <Button
            onClick={() => handleSubmit(element._id)}
            
          >
            Enviar
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div style={{ marginTop: '60px', marginLeft: 0 }}>
        <Table>
          <thead>
            <tr>
              <th>Nivel</th>
              <th>Solicitante</th>
              <th>Tipo de Problema</th>
              <th>Descripción del Usuario</th>
              <th>Fecha Ticket</th>
              <th>Descripción del Sistema</th>
              <th>Requiere Compras</th>
              <th>Fecha arribo Administracion</th>
              <th>Presupuesto</th>
              <th>Estimación de Finalización</th>
              <th>Fecha de Solución</th>
              <th>Aprobado por Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <div />
        {showNotification && (
          <Notification onClose={handleNotificationClose} color="teal">
            Los datos se modificaron correctamente.
          </Notification>
        )}
      </div>
    </div>
  );
}

export default FormSistemas;
