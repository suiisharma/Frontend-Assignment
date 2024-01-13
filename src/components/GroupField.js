import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import './styles/GroupField.css'; // Import your CSS module
import TextInputField from './InputField';
import RadioField from './RadioField';
import SelectField from './SelectField';
import ConditionalInput from './ConditionalFields';
import ConditionalInputRenderer from './ConditionalFieldRenderer';
import SwitchButton from './SwitchInput';

const GroupField = ({ fieldData, setState, state,setError }) => {
  const { label, description, validate, jsonKey, uiType, subParameters } = fieldData;

  const [localState, setLocalState] = useState({})

  useEffect(() => {
    setState((prevstate) => ({
      ...prevstate, [jsonKey]: {
        ...localState
      }
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localState])

  return uiType === 'Group' ? (
    <div className="group-subField" key={jsonKey} >
      <Tooltip title={description} >
        <div className="label">
          <span>{label}</span>
          {description && <InfoCircleFilled style={{
            color: ' #096dd9'
          }} className="info" />}
          {validate.required && <span className="required">*</span>}
        </div>
      </Tooltip>
      <div className="sub-parameters">
        {subParameters && subParameters.sort((a, b) => a.sort - b.sort) && subParameters.map((subField, index) => {
          if (subField.uiType === 'Input') {
            return <TextInputField setError={setError} key={subField.jsonKey} state={localState} fieldData={subField} setState={setLocalState} />;
          }
          if (subField.uiType === "Radio") {
            return <RadioField key={subField.jsonKey} state={localState} fieldData={subField} setState={setLocalState} ></RadioField>
          }
          if (subField.uiType === "Group") {
            return <GroupField key={subField.jsonKey} setError={setError} state={localState} fieldData={subField} setState={setLocalState}></GroupField>
          }
          if (subField.uiType === "Select") {
            return <SelectField key={subField.jsonKey} state={localState} fieldData={subField} setState={setLocalState}></SelectField>
          }
          if (subField.uiType === "Ignore") {
            return (<ConditionalInput key={index} fieldData={subField} state={state} setState={setState}>

              <Tooltip title={description} >
                <div className="label">
                  <span>{subField.label}</span>
                  {subField.description && <InfoCircleFilled className="info" />}
                  {subField.validate.required && <span className="required">*</span>}
                </div>
              </Tooltip>
              <ConditionalInputRenderer setError={setError} fieldData={subField} state={state} setState={setState} />
            </ConditionalInput>)
          }
          if (subField.uiType === "Switch") {
            return <SwitchButton key={index} fieldData={subField} state={localState} setState={setLocalState}></SwitchButton>
          }
          return null;
        })}
      </div>
    </div>
  ) : null;
};

export default GroupField;
