import React, { useState, useEffect } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import backendURL from '../config';

const ReservationForm = () => { 
  const [grades, setGrades] = useState([]);
  const [selectedModules, setSelectedModules] = useState({});
  const [selectedGrades, setSelectedGrades] = useState({});
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])
  const additionalFields = [];
  const {admin} = useAuthContext()
  const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        anotherphone: '',
        grade: [],
        modules: [],
        copiesNumber: []
      });
    const [additionalFieldsCount, setAdditionalFieldsCount] = useState(0);

    useEffect(() => {
      fetch(`${backendURL}/grade/allgrades`, {
        headers: {
          'Authorization': `Bearer ${admin.token}`,
          'Content-Type': 'application/json'
        },
      }).then(res => res.json())
        .then(result => {
          console.log("result ", result)
          setGrades(result.grades)
          console.log("Grades: ", result.grades)
        })
        .catch((error) => {
          console.error('Error fetching data:', error); // Log any errors that occur
        });
    }, [])
    const handleNameInputChange = (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, name: value }));
      console.log(formData.name)
      console.log("Admin token: ", admin.token)
    };
    const handleAddressInputChange = (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, address: value }));
      console.log(formData.address)
    };
    const handlePhoneInputChange = (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, phone: value }));
      console.log(formData.phone)
    };
    const handleAnotherPhoneInputChange = (e) => {
      const { value } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, anotherphone: value }));
      console.log(formData.anotherphone)
    };

    const handleCopyCountChange = (e, moduleIndex, index) => {
      const { value } = e.target;
      const intValue = parseInt(value);
      setFormData((prevFormData) => {
        const updatedCopiesNumber = [...prevFormData.copiesNumber]; 
        const gradeIndex = prevFormData.grade.findIndex((_, i) => i === index);
      
        if (!updatedCopiesNumber[gradeIndex]) {
          updatedCopiesNumber[gradeIndex] = [];
        }
      
        updatedCopiesNumber[gradeIndex][moduleIndex] = intValue;
      
        return { ...prevFormData, copiesNumber: updatedCopiesNumber };
      });
    };
    
    const handleCheckboxChange = (e, index) => {
      const { name, checked } = e.target
      setFormData((prevFormData) => {
        const updatedOptions = [...prevFormData.modules]; 
        console.log("updatedOptions: ", updatedOptions)
        const gradeIndex = prevFormData.grade.findIndex((_, i) => i === index);
        if (checked) {
          if (!updatedOptions[gradeIndex]) {
            updatedOptions[gradeIndex] = [];
          }
    
          if (!updatedOptions[gradeIndex].includes(name)) {
            updatedOptions[gradeIndex].push(name);
          }
        } else {
          updatedOptions[gradeIndex] = updatedOptions[gradeIndex].filter(
            (option) => option !== name
          );
        }
    
        return { ...prevFormData, modules: updatedOptions };
      });
    };
    

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("name", formData.name)
    console.log("grades",formData.grade)
    console.log("address",formData.address)
    console.log("phone",formData.phone)
    console.log("another phone",formData.anotherphone)
    console.log("modules",formData.modules)
    console.log("copies count",formData.copiesNumber)
    console.log("form data",formData)

    if (!formData.name || !formData.phone) {
      console.log(111)
      setError("Please fill in all required fields.");
      return;
    }
  
    if (formData.grade.length === 0 || formData.grade.includes("")) {
      console.log(222)
      setError("Please select a grade for each reservation.");
      return;
    }
  
    for (let i = 0; i < formData.grade.length; i++) {
      if (formData.modules[i].length === 0) {
      console.log(333)

        setError(`Please select modules for ${formData.grade[i]}.`);
        return;
      }
      if (formData.copiesNumber[i].length === 0) {
      console.log(444)
        setError(`Please select number of copies for ${formData.modules[i]}.`);
        return;
      }
      if(formData.copiesNumber[i].toString().includes('')){
        formData.copiesNumber[i] = formData.copiesNumber[i].filter(copies => copies !== '');
        console.log("YES: ", formData.copiesNumber[i][1])
        
      }
      
      if(formData.grade[i] == ""){
      console.log(555)

        setError(`Please select a grade.`);
        return;
      }
    }


    const response = await fetch(`${backendURL}/reservation/newReservation`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${admin.token}`
      }
    })
    const json = await response.json()
    const emptyF = await response.json.emptyFields
    if (!response.ok) {
      console.log(json.error)
      console.log(json.error)
      console.log(json.error)
      console.log(json.error)
      setError(json.error)
      setEmptyFields(emptyF)
    }
    if (response.ok) {
      console.log(null)
      console.log(null)
      console.log(null)
      console.log(null)

      setError(null)
      setMessage(json.message)
      setEmptyFields([])
      console.log('new reservation added:', json)
      console.log('new /reservation added:', json.message)
    }
  }
  const handleAddFields = () => {
    setAdditionalFieldsCount((prevCount) => prevCount + 1);
  };
  
  const handleGradeChange = (e, index) => {
    const { value } = e.target;
    console.log("value is: ", value)
    const selectedG = grades.find((g) => g.gradeName === value);
    console.log("selectedGrade is: ", selectedG)
    setSelectedGrades(selectedG)
    setFormData((prevFormData) => {
      const updatedGrades = [...prevFormData.grade];
      updatedGrades[index] = value;
  
      const updatedOptions = [...prevFormData.modules];
      updatedOptions[index] = [];
  
      const updatedCopiesNumber = [...prevFormData.copiesNumber];
      updatedCopiesNumber[index] = [];
  
      return { ...prevFormData, grade: updatedGrades, modules: updatedOptions, copiesNumber: updatedCopiesNumber };
    });
  };
  const renderAdditionalFields = () => {
    for (let i = 0; i < additionalFieldsCount; i++) {
      additionalFields.push(
        <div key={i}>
          <label>
            الصف
            <select
              style={{ margin: '10px', fontSize:"20px"}}
              name="grade"
              onChange={(e) => handleGradeChange(e, i)}
              value={formData.grade[i] || ''}
            >
            <option value="">الصف</option>
            {grades.map((g) => (
              <option key={g._id} value={g.gradeName}>{g.gradeName}</option>
            ))}
            </select>
          </label>
          <br />
          {formData.grade[i] && (
  <div style={{ color: "red" }}>
    اختار المواد
    {selectedGrades && (
      <div className='checkbox-options'>
        {selectedGrades.modules.map((module, moduleIndex) => (
          <label key={module._id}>
            <input
              type="checkbox"
              name={module.moduleName}
              checked={formData.modules[i].includes(module.moduleName)}
              onChange={(e) => handleCheckboxChange(e, i)}
            />
            {module.moduleName}
            <input 
            style={{ margin: '3px', minWidth: '22px' }}
            type="number"
            name="count"
            value={formData.copiesNumber[i][moduleIndex] || 0}
            required
            onChange={(e) => handleCopyCountChange(e,moduleIndex, i)}
            />
          </label>
        ))}
      </div>
              )}
            </div>
          )}
        </div>
      );
    }
    return additionalFields;
  };


  return (
    <div className='reservation-form-container'>
      <h1>حجز جديد</h1>
      <form>
        <label>
          اسم الطالب
          <input
          style={{margin: '10px'}}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleNameInputChange}
          />
        </label>
        <br />
        <label>
          رقم التليفون
          <input
          style={{margin: '10px'}}
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneInputChange}
          />
        </label>
        <label>
          رقم تليفون آخر
          <input
          style={{margin: '10px'}}
            type="text"
            name="phone"
            value={formData.anotherphone}
            onChange={handleAnotherPhoneInputChange}
          />
        </label>
        <br />
        <label>
          العنوان
          <input
          style={{margin: '10px'}}
            type="text"
            name="address"
            value={formData.address}
            onChange={handleAddressInputChange}
          />
        </label>
        <br />
        
        {renderAdditionalFields()}
        </form>
        <button onClick={handleAddFields}>+</button>
        <br />
        <br />
        <button onClick={handleSubmit} className='submit-button'>Submit</button>
        {error && <div className="error">{error.message}</div>}
        {message && <div className="successMessage">{message.message}</div>} 
      </div>
    );
  };
  
  export default ReservationForm;