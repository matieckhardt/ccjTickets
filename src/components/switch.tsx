import React, { useState } from 'react';
import Switch from '@mui/material/Switch';

interface ComprasSwitchProps {
  onSwitchChange: (value: boolean) => void;
}

function ComprasSwitch(props: ComprasSwitchProps) {
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setChecked(value);
    props.onSwitchChange(value);
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
}

export default ComprasSwitch;
