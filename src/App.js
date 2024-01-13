import React, { useEffect, useState } from 'react'
import './App.css';
import JsonEditor from './components/JsonEditor';
import FormPreview from './components/FormPreview';
import pizaJson from './data/pizza.json';


const App = () => {
  const [jsonData, setJsonData] = useState(pizaJson);
  const [formState, setFormState] = useState({});
  const [loading,setLoading]=useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLoading(true)
    setFormState({})
    setTimeout(()=>{setLoading(false)},1000)
  }, [jsonData])

  return (
    <div className="app-container">
      <div className="fixed-width ">
        <JsonEditor jsonData={jsonData} setJsonData={setJsonData} />
      </div>
      <div className="half-width">
        {
          !loading &&
          <FormPreview jsonData={jsonData} formState={formState} setFormState={setFormState} setJsonData={setJsonData} />
        }
      </div>
    </div>
  )
}

export default App