import React, { useState, useEffect } from 'react';
import { Input, Alert } from 'antd';
import './styles/JSONEditor.css';

const JsonEditor = ({ jsonData, setJsonData }) => {
    const [editorContent, setEditorContent] = useState(JSON.stringify(jsonData, null, 2));
    const [error, setError] = useState(null);

    const handleChange = (value) => {
        setEditorContent(value);
        try {
            const parsed = JSON.parse(value);
            setJsonData(parsed);
            setError(null);
        } catch (e) {
            setError(e.toString());
        }
    };

    useEffect(() => {
        setEditorContent(JSON.stringify(jsonData, null, 2));
    }, [jsonData]);

    return (
        <div className="json-editor-container">
            <div className="json-editor-title">JSON Editor</div>
            <div className="json-editor">
                <Input.TextArea
                    className="json-editor-textarea numbered"
                    value={editorContent}
                    onChange={(e) => handleChange(e.target.value)}
                    spellCheck={false}
                />
                {error && (
                    <Alert
                        message="JSON Parsing Error"
                        description={error}
                        type="error"
                        showIcon
                        className="json-error-alert"
                    />
                )}
            </div>
        </div>
    );
};

export default JsonEditor;
