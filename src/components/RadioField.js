// RadioField.jsx
import React, { useEffect } from 'react';
import { Radio, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import './styles/RadioField.css'; 

const RadioField = ({ fieldData, setState }) => {
    const { label, description, validate, uiType, jsonKey } = fieldData;
    const { options, defaultValue } = validate;

    const handleSelectedChange = (value) => {
        setState((prevState) => ({ ...prevState, [jsonKey]: value }));
    };

    useEffect(() => {
        setState((prevState) => ({ ...prevState, [jsonKey]: defaultValue }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState]);

    return uiType === 'Radio' ? (
        <div className="radio-field-container" key={jsonKey}>
            <Tooltip title={description}>
                <div className="label">
                    <span>{label}</span>
                    {description && <InfoCircleFilled className="info" />}
                    {validate.required && <span className="required">*</span>}
                </div>
            </Tooltip>
            <Radio.Group   defaultValue={defaultValue} buttonStyle='solid' className="radio-group" onChange={(e) => handleSelectedChange(e.target.value)}>
                {options.map((option) => (
                    <Radio.Button key={option.value}  value={option.value} >
                        {option.label}
                    </Radio.Button>
                ))}
            </Radio.Group>
        </div>
    ) : null;
};

export default RadioField;
