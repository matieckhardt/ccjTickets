import React, { useState, useEffect } from 'react';
import { Table, Button, TextInput, Notification } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import axios from 'axios';

interface Props {
  usuarios: {
    _id: number;
    nivel: string;
    solicitante: string;
    tipoProblema: string;
    dateTicket: string;
    presupuesto: number;
    descripUser: string;
    dirAprobe: boolean;
    dateSolved: string;
    
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
  const [submittedRows, setSubmittedRows] = useState<Set<number>>(new Set());
  const [completedRows, setCompletedRows] = useState<Set<number>>(new Set());
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Cargar filas enviadas desde el almacenamiento local al iniciar la página
    const submittedRowsFromStorage = localStorage.getItem('submittedRowsSistemas');
    if (submittedRowsFromStorage) {
      setSubmittedRows(new Set(JSON.parse(submittedRowsFromStorage)));
    }

    // Inicializar los valores por defecto
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

  useEffect(() => {
    
    localStorage.setItem('submittedRowsSistemas', JSON.stringify(Array.from(submittedRows)));
  }, [submittedRows]);

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
        estimFin: currentUserFormValues.estimFin?.toISOString() || '',
        descripSist: currentUserFormValues.descripSist,
        dateSolved: currentUserFormValues.dateSolved || undefined,
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

          if (currentUserFormValues.dateSolved) {
            setCompletedRows((prevCompletedRows) => new Set(prevCompletedRows).add(userId));
          }
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
    if (submittedRows.has(element._id) || completedRows.has(element._id)) {
      return null; // Omitir las filas enviadas y completadas
    }

    const initialValues = formValues[element._id];

    return (
      <tr key={element._id}>
        <td>{element.nivel}</td>
        <td>{element.solicitante}</td>
        <td>{element.tipoProblema}</td>
        <td>{element.descripUser}</td>
        <td>{element.dateTicket}</td>
        <td>{element.presupuesto}</td>
        <td>
          <Button
            radius="md"
            size="md"
            onClick={() => handleRequiereComprasChange(true, element._id)}
            variant={initialValues?.requiereCompras ? 'filled' : 'outline'}
          >
            Si
          </Button>
          <Button
            radius="md"
            size="md"
            onClick={() => handleRequiereComprasChange(false, element._id)}
            variant={!initialValues?.requiereCompras ? 'filled' : 'outline'}
          >
            No
          </Button>
        </td>
        <td>
          <DatePickerInput
            required
            value={initialValues?.estimFin}
            onChange={(value) => handleEstimFinChange(value, element._id)}
          />
        </td>
        <td>
          <TextInput
            required
            value={initialValues?.descripSist}
            onChange={(event) => handleDescripSistChange(event.currentTarget.value, element._id)}
          />
        </td>
        <td>
          <DatePickerInput
            required
            value={initialValues?.dateSolved}
            onChange={(value) => handleDateSolvedChange(value, element._id)}
          />
        </td>
        <td style={{ color: element.dirAprobe ? 'green' : 'red' }}>
          {element.dirAprobe ? 'Aprobado' : 'No aprobado'}
        </td>
        <td>
          <Button
            radius="md"
            size="md"
            onClick={() => handleSubmit(element._id)}
            disabled={!initialValues?.estimFin || !initialValues?.descripSist}
          >
            Enviar
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <Table striped>
        <thead>
          <tr>
            <th>Nivel</th>
            <th>Solicitante</th>
            <th>Tipo de Problema</th>
            <th>Descripción del Usuario</th>
            <th>Fecha del Ticket</th>
            <th>Presupuesto</th>
            <th>Requiere Compras</th>
            <th>Estimación de Finalización</th>
            <th>Descripción del Sistema</th>
            <th>Fecha de Solución</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      <Notification
          title="Ticket actualizado"
          color="blue"
          onClose={handleNotificationClose}
        >
          El ticket ha sido actualizado exitosamente.
        </Notification>
    </div>
  );
}

export default FormSistemas;
