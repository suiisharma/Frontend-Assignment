import React, { useEffect, useState } from 'react';
import TextInputField from './InputField';
import RadioField from './RadioField';
import GroupField from './GroupField';
import SelectField from './SelectField';
import ConditionalInput from './ConditionalFields';
import SwitchButton from './SwitchInput';

const ConditionalInputRenderer = ({ fieldData,state, setState,setError }) => {
  const { subParameters, jsonKey } = fieldData;

  const [localState, setLocalState] = useState({});
  useEffect(() => {
    setState((prevstate) => ({ ...prevstate, [jsonKey]: { ...localState } }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localState, jsonKey])


  return <div style={{ marginLeft: '20px' }}>
    {subParameters && subParameters.sort((a, b) => a.sort - b.sort) && subParameters.map((subField, index) => {
      if (subField.uiType === 'Input') {
        return <TextInputField setError={setError} key={index}state={localState} fieldData={subField} setState={setLocalState} />;
      }
      if (subField.uiType === "Radio") {
        return <RadioField key={index}state={localState} fieldData={subField} setState={setLocalState} ></RadioField>
      }
      if (subField.uiType === "Group") {
        return <GroupField setError={setError} key={index}state={localState} fieldData={subField} setState={setLocalState}></GroupField>
      }
      if (subField.uiType === "Select") {
        return <SelectField key={index}state={localState} fieldData={subField} setState={setLocalState}></SelectField>
      }
      if (subField.uiType === "Ignore") {
        return (<ConditionalInput key={index} fieldData={subField} state={state} setState={setState}>
          <label>
            {subField.label}
            {subField.description && <span>{subField.description}</span>}
            {subField.validate.required && <span>*</span>}
          </label>
          <ConditionalInputRenderer setError={setError} fieldData={subField} state={state} setState={setState} />
        </ConditionalInput>)
      }
      if(subField.uiType==="Switch"){
        return <SwitchButton key={index} fieldData={subField} state={localState} setState={setLocalState}></SwitchButton>
      }
      return null;
    })}
  </div>;
};

export default ConditionalInputRenderer;
