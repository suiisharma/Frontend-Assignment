import React, { useEffect, useState } from 'react';
import { Select, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import './styles/SelectField.css';


const SelectField = ({ fieldData, setState }) => {
    const { label, description, validate, level, uiType, jsonKey } = fieldData;
    const { options, defaultValue, immutable } = validate
    const [selectedValue, setSelectedValue] = useState(defaultValue)

    useEffect(() => {
        setState((prevstate) => ({ ...prevstate, [jsonKey]: selectedValue }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setState])

    const HandleChangeSelectedValue = (value) => {
        setSelectedValue(value)
        setState((prevstate) => ({ ...prevstate, [jsonKey]: value }))
    }


    return uiType === 'Select' ? (
        <div className={`select-field level-${level}`}  >
            <Tooltip title={description}>
                <div className="label">
                    <span>{label}</span>
                    {description && <InfoCircleFilled style={{
                        color: ' #096dd9'
                    }} className="info" />}
                    {validate.required && <span className="required">*</span>}
                </div>
            </Tooltip>
            <Select defaultValue={defaultValue} className="select" disabled={immutable} value={selectedValue} onChange={HandleChangeSelectedValue}>
                {options.map((option) => (
                    <Select.Option key={option?.value || option} value={option?.value || option}>
                        {option.label || option}
                    </Select.Option>
                ))}
            </Select>
        </div>
    ) : null;
};

export default SelectField;
