import { createStyles, rem, Select, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import React, { useState } from 'react';
import { Button } from '@mantine/core';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import SideBar from './sidebar';
const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
  },

  input: {
    height: rem(54),
    paddingTop: rem(18),
  },

  label: {
    position: 'absolute',
    pointerEvents: 'none',
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: `calc(${theme.spacing.sm} / 2)`,
    zIndex: 1,
  },
}));

interface FormDocentesProps {
  selectLabel: string;
  selectPlaceholder: string;
  textInputLabel: string;
  textInputPlaceholder: string;
  datePickerLabel: string;
  datePickerPlaceholder: string;
  userType: string;
  userName: string;
  usuarios: any;
}

export function FormDocentes(props: FormDocentesProps) {
  const { classes } = useStyles();
  const today = new Date(Date.now());
  const navigate = useNavigate();

 
  const [formValues, setFormValues] = useState({
    tipoProblema: '',
    descripUser: '',
    dateTicket: null as Date | null,
    nivel: props.userType,
    solicitante: props.userName,
  });

  
  const handleSelectChange = (value: string) => {
    setFormValues({ ...formValues, tipoProblema: value });
  };

  
  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, descripUser: event.target.value });
  };

  
  const handleDatePickerChange = (value: Date | null) => {
    setFormValues({ ...formValues, dateTicket: value });
  };

  
  const handleSubmit = () => {
    
    if (
      formValues.tipoProblema &&
      formValues.descripUser &&
      formValues.dateTicket
    ) {
      axios
        .post('https://colegiociudadjardin.edu.ar/newTicket', formValues)
        .then(response => {
          navigate('/tickets');
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  

  return (
    <div >
      <SideBar/>
      
    <div style={{ width: '80vw', display: 'flex', flexDirection: 'column', gap: '10%', marginLeft:'15%'}}>
      <TextInput
        label="Tipo de usuario"
        value={props.userType}
        disabled={true}
        classNames={classes}
        style={{ marginTop: '15px' }}
        />
      <TextInput
        label="Nombre de usuario"
        value={props.userName}
        disabled={true}
        classNames={classes}
        style={{ marginTop: '15px' }}
        />
      <Select
        required
        mt="md"
        withinPortal
        data={['Problema de Software', 'Problema de Hardware', 'Repuestos', 'nose']}
        placeholder={props.selectPlaceholder}
        label={props.selectLabel}
        classNames={classes}
        value={formValues.tipoProblema}
        onChange={handleSelectChange}
        />

      <TextInput
        required
        label={props.textInputLabel}
        placeholder={props.textInputPlaceholder}
        classNames={classes}
        style={{ marginTop: '15px' }}
        value={formValues.descripUser}
        onChange={handleTextInputChange}
        />

      <DatePickerInput
        required
        mt="md"
        popoverProps={{ withinPortal: true }}
        label={props.datePickerLabel}
        placeholder={props.datePickerPlaceholder}
        classNames={classes}
        clearable={false}
        value={formValues.dateTicket}
        onChange={handleDatePickerChange}
        />

      <DatePickerInput
        required
        mt="md"
        popoverProps={{ withinPortal: true }}
        label="Fecha de hoy"
        value={today}
        placeholder="Fecha de hoy"
        classNames={classes}
        disabled={true}
        />

<Button
  radius="md"
  size="md"
  onClick={handleSubmit}
  disabled={
    !(
      formValues.tipoProblema &&
      formValues.descripUser &&
      formValues.dateTicket
      )
    }
>
  Enviar
</Button>

    </div>
  </div>
  );
}

export default FormDocentes;
