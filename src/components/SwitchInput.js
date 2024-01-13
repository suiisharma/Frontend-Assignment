import React, { useEffect, useState } from 'react';
import { Switch ,Tooltip} from 'antd';
import {InfoCircleFilled} from '@ant-design/icons'
const SwitchButton = ({ fieldData, setState }) => {

    
    const { label, description, validate, jsonKey } = fieldData;
    const { required, defaultValue } = validate

    const [localState, setLocalState] = useState(defaultValue)

    const handleSwitchChange = () => {
    setLocalState((prev)=>!prev)
    };
    
    useEffect(()=>{
    setState((prev)=>({...prev,[jsonKey]:localState}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[localState])

    return (
        <div>
            <Tooltip title={description} >
                <div className="label">
                    <span>{label}</span>
                    {description && <InfoCircleFilled style={{color: ' #096dd9'}} className="info" />}
                    {required && <span className="required">*</span>}
                </div>
            </Tooltip>
            <Switch
                id="switch"
                onChange={handleSwitchChange}
                checked={localState}
                defaultChecked={defaultValue}
            />
            <p>{localState ? `${jsonKey} selected!` : `${jsonKey} not selected!`}</p>
        </div>
    );
};

export default SwitchButton;
