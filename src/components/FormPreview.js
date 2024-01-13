import React, { useEffect, useState } from 'react';
import { Modal, Button, Spin, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import TextInputField from './InputField';
import GroupField from './GroupField';
import RadioField from './RadioField';
import SelectField from './SelectField';
import ConditionalInput from './ConditionalFields';
import ConditionalInputRenderer from './ConditionalFieldRenderer';
import SwitchButton from './SwitchInput';

import './styles/FormPreview.css';

const FormPreview = ({ jsonData, formState, setFormState }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [resultJson, setResultJson] = useState({ ...formState });
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setResultJson({ ...formState });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])


  const getNestedPropertyValue = (object, keys) => {
    return keys.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), object);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErrorModalOpen(false);
  };

  const handleGroup = async (field, state) => {
    field.subParameters && field.subParameters.map(async (subField) => {
      if (subField.uiType === 'Group') {
        const val = getNestedPropertyValue(state, field.jsonKey)
        await handleGroup(subField, val)
      }
      if (subField.uiType === 'Ignore') {
        await handleIgnore(subField, state)
      }
      if (subField.uiType === "Select" || subField.uiType === "Radio" || subField.uiType === 'Input' || subField.uiType === 'Switch') {
        const val = getNestedPropertyValue(state, field.jsonKey)
        await handleError(subField, val);
      }
      return null;
    }
    )
  }



  const handleIgnore = async (field, state) => {
    const { conditions, jsonKey } = field;
    if (conditions && conditions.length > 0) {
      let conditionMet = true
      await conditions.map(async (condition) => {
        const { jsonKey, op, value } = condition;
        const conditionValue = await getNestedPropertyValue(state, jsonKey);
        switch (op) {
          case '==':
            conditionMet &= (conditionValue === value);
            break;
          default:
            conditionMet &= false;
        }
      });
      if (!conditionMet) {
        delete state[[jsonKey]]
      }
    }


    field.subParameters && field.subParameters.map(async (subField) => {
      if (subField.uiType === 'Group') {
        const val = getNestedPropertyValue(state, field.jsonKey)
        await handleGroup(subField, val)
      }
      if (subField.uiType === 'Ignore') {
        await handleGroup(subField, state)
      }
      if (subField.uiType === "Select" || subField.uiType === "Radio" || subField.uiType === 'Input' || subField.uiType === 'Switch') {
        const val = getNestedPropertyValue(state, field.jsonKey)
        await handleError(subField, val);
      }
      return null;
    }
    )

  }
  const handleError = async (field, state) => {

    if (state && field?.validate?.required && (! await getNestedPropertyValue(state, field.jsonKey) && await getNestedPropertyValue(state, field.jsonKey) !== false)) {
      setErrorModalOpen(true)
    }
  }
  const handleSubmit = async () => {
    try {
      for (const field of jsonData.sort((a, b) => a.sort - b.sort)) {
        if (field.uiType === 'Group') {
          await handleGroup(field, resultJson);
        }
        if (field.uiType === 'Ignore') {
          await handleIgnore(field, resultJson);
        }
        if (field.uiType === 'Select' || field.uiType === 'Radio' || field.uiType === 'Input' || field.uiType === 'Switch') {
          await handleError(field, resultJson);
        }
      }

      if (!error) {
        setModalOpen(true);
      }
    } catch (err) {
      setErrorModalOpen(true);
      console.error('An error occurred during form submission:', err);
    }
  };

  return (
    <div className='form-preview-container'>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        jsonData &&
        jsonData.sort((a, b) => a.sort - b.sort) &&
        jsonData.map((field, index) => {
          if (field.uiType === 'Input') {
            return (
              <TextInputField
                key={index}
                state={formState}
                setError={setError}
                fieldData={field}
                setState={setFormState}
              />
            );
          }
          if (field.uiType === 'Radio') {
            return (
              <RadioField
                key={index}
                state={formState}
                fieldData={field}
                setState={setFormState}
              ></RadioField>
            );
          }
          if (field.uiType === 'Group') {
            return (
              <GroupField
                key={index}
                state={formState}
                setError={setError}
                fieldData={field}
                setState={setFormState}
              ></GroupField>
            );
          }
          if (field.uiType === 'Select') {
            return (
              <SelectField
                key={index}
                state={formState}
                fieldData={field}
                setState={setFormState}
              ></SelectField>
            );
          }
          if (field.uiType === 'Ignore') {
            return (
              <ConditionalInput
                key={index}
                fieldData={field}
                state={formState}
                setState={setFormState}
              >
                <Tooltip title={field?.description}>
                  <div className="label">
                    <span>{field?.label}</span>
                    {field?.description && <InfoCircleFilled style={{ color: ' #096dd9' }} className="info" />}
                    {field?.validate?.required && <span className="required">*</span>}
                  </div>
                </Tooltip>
                <ConditionalInputRenderer
                  fieldData={field}
                  state={formState}
                  setState={setFormState}
                  setError={setError}
                />
              </ConditionalInput>
            );
          }
          if (field.uiType === 'Switch') {
            return <SwitchButton key={index} fieldData={field} state={formState} setState={setFormState}></SwitchButton>;
          }
          return null;
        })
      )}
      <Button type='primary' onClick={handleSubmit} className='color'>
        Submit
      </Button>
      <Modal
        open={errorModalOpen ? false : isModalOpen}
        onCancel={closeModal}
        title="JSON to be sent to the backend"
        footer={[
          <Button className='color' type='primary' key="close" onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        <pre>{JSON.stringify(resultJson, null, 2)}</pre>
      </Modal>
      <Modal
        open={errorModalOpen}
        onCancel={closeModal}
        title="Error"
        footer={[
          <Button type='primary' key="close" className='color' onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        <p style={{ color: 'red' }}>An error occurred while processing the form. Please check if provided values are valid. </p>
      </Modal>
    </div>
  );
};

export default FormPreview;
