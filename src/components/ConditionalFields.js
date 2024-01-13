import React, { useState, useEffect } from 'react';
import './styles/ConditionalFields.css';

const ConditionalInput = ({ fieldData, state, children}) => {
  const { conditions} = fieldData;

  const [isVisible, setIsVisible] = useState(true);
  
  const getNestedPropertyValue = (object, keys) => {
    return keys.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), object);
  };

  useEffect(() => {
    // Check conditions and update visibility
    if (conditions && conditions.length > 0) {
      const conditionMet = conditions.every(condition => {
        const { jsonKey, op, value } = condition;
        
        const conditionValue =getNestedPropertyValue(state,jsonKey)
          
        
        // Perform comparison based on the operator
        switch (op) {
          case '==':
            return conditionValue === value;
          // Add more comparison cases if needed

          default:
            return false;
        }
      });

      setIsVisible(conditionMet);
      
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditions,state]);

  return isVisible ? <>{children}</> : null;
};

export default ConditionalInput;
