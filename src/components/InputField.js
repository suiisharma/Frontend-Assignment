import React, { useEffect, useState } from 'react';
import { Input, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import './styles/TextInputField.css';

const TextInputField = ({ fieldData, setState,setError:SetError }) => {

    const { label, description, validate, jsonKey, uiType, placeholder } = fieldData;
    const [localState, setLocalState] = useState(null)

    const [error, setError] = useState(null)

    const { pattern } = validate

    useEffect(() => {
        setState((prevstate) => ({ ...prevstate, [jsonKey]: localState }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localState])



    // Validate the input value based on the provided regex pattern
    const validator = (e) => {
        const value = e.target.value;
        if (pattern && value) {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
                setError('Invalid input...')
                SetError(true)
                setLocalState(null)
            }
            else {
                setError(null)
                SetError(false)
                setLocalState(value)
            }
        }
        else {
            setError(null)
            SetError(false)
            setLocalState(value)
        }
    };

    return uiType === 'Input' ? (
        <div className="input-field" key={jsonKey}>
            <Tooltip title={description} >
                <div className="label">
                    <span>{label}</span>
                    {description && <InfoCircleFilled style={{
                        color: ' #096dd9'
                    }} className="info" />}
                    {validate.required && <span className="required">*</span>}
                </div>
            </Tooltip>
            <Input
                className="input"
                placeholder={placeholder}
                disabled={validate.immutable}
                onChange={validator}
            />
            {
                error && <div className="error-div">
                    {
                        error
                    }
                </div>
            }
        </div>
    ) : null;
};

export default TextInputField;
