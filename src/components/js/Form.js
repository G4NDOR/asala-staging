// Form.js
import React, { useState } from 'react';
import TextInput from './TextInput';
import TextArea from './TextArea';
import ToggleSwitch from './ToggleSwitch';
import SelectInput from './SelectInput';
import RadioGroup from './RadioGroup';
import CheckboxGroup from './CheckboxGroup';
import '../css/Form.css';

function Form() {
  const [textValue, setTextValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [toggleValue, setToggleValue] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [radioValue, setRadioValue] = useState('');
  const [checkboxValues, setCheckboxValues] = useState([]);

  const handleCheckboxChange = (value) => {
    setCheckboxValues((prevValues) =>
      prevValues.includes(value)
        ? prevValues.filter((val) => val !== value)
        : [...prevValues, value]
    );
  };

  return (
    <form className="form">
      <h1>Sample Form</h1>
      <TextInput label="Text Input" value={textValue} onChange={(e) => setTextValue(e.target.value)} />
      <TextArea label="Text Area" value={textAreaValue} onChange={(e) => setTextAreaValue(e.target.value)} />
      <ToggleSwitch label="Toggle Switch" checked={toggleValue} onChange={() => setToggleValue(!toggleValue)} />
      <SelectInput
        label="Select Input"
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ]}
        value={selectValue}
        onChange={(e) => setSelectValue(e.target.value)}
      />
      <RadioGroup
        label="Radio Group"
        name="radio"
        options={[
          { label: 'Radio 1', value: '1' },
          { label: 'Radio 2', value: '2' },
        ]}
        value={radioValue}
        onChange={setRadioValue}
      />
      <CheckboxGroup
        label="Checkbox Group"
        options={[
          { label: 'Checkbox 1', value: '1' },
          { label: 'Checkbox 2', value: '2' },
        ]}
        values={checkboxValues}
        onChange={handleCheckboxChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
