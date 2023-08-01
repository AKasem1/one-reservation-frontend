import React, { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";

const UpdateGrade = () => {
    const [grade, setGrade] = useState(null);
    const [selectedModule, setSelectedModule] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
      gradeName: '',
      moduleName: '',
      stock: 0,
      price: 0
    });
  
    const { admin } = useAuthContext();
    const gradesArr = ['Prim 1', 'Prim 2', 'Prim 3', 'Prim 4', 'Prim 5', 'Prim 6', 'Prep 1', 'Prep 2', 'Prep 3'];
  
    const handleGradeChange = async (e) => {
      const { value } = e.target;
      const response = await fetch(`/grade/getGrade/${value}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${admin.token}`
        }
      });
  
      const json = await response.json();
      if (response.ok) {
        setGrade(json.grade);
      }
    };
  
    const handleModuleChange = (e) => {
      setSelectedModule(e.target.value);
    };
  
    const handlePriceChange = (e) => {
      const price = e.target.value;
      if (price === '') {
        setPrice(0);
      } else {
        setPrice(price);
      }
    };
  
    const handleStockChange = (e) => {
      const stock = e.target.value;
      if (stock === '') {
        setStock(0);
      } else {
        setStock(stock);
      }
    };
  
    const onUpdate = async (e) => {
      e.preventDefault();
      console.log("Grade: ", grade.gradeName)
      const updatedData = {
        gradeName: grade.gradeName,
        moduleName: selectedModule,
        price: price,
        stock: stock,
      };
      console.log(updatedData)
      const updateResponse = await fetch(`/grade/updateGrade`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
        headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`
        }
      });
      const json = await updateResponse.json();
      if (updateResponse.ok) {
        setError(null);
        setMessage(json.message);
      } else {
        setError(json.error);
      }
    };

  return (
    <div>
      <form className="update-grade-form">
      <h1>Update Grade</h1>
        <select
          style={{ margin: '10px', height: '50px', padding: '5px', fontSize: '20px', width: '100px' }}
          name="grade"
          onChange={(e) => handleGradeChange(e)}
        >
          <option value="">الصف</option>
          {gradesArr.map((g) => (
            <option key={g} value={g} style={{ fontSize: "20px" }}>
              {g}
            </option>
          ))}
        </select>
        {grade && grade.modules && (
          <select
            style={{ margin: '10px', height: '50px', padding: '5px', fontSize: '20px', width: '150px' }}
            name="module"
            value={selectedModule}
            onChange={handleModuleChange}
          >
            <option value="">اختر المادة</option>
            {grade.modules.map((module) => (
              <option key={module._id} value={module.moduleName} style={{ fontSize: "20px" }}>
                {module.moduleName}
              </option>
            ))}
          </select>
        )}
        {selectedModule && (
          <input
            type="number"
            placeholder="السعر"
            value={price}
            onChange={handlePriceChange}
            style={{ margin: '10px', height: '30px', padding: '5px', fontSize: '20px', width: '150px' }}
          />
        )}
        {selectedModule && (
          <input
            type="number"
            placeholder="الكمية"
            value={stock}
            onChange={handleStockChange}
            style={{ margin: '10px', height: '30px', padding: '5px', fontSize: '20px', width: '150px' }}
          />
        )}
        <button type="submit" onClick={onUpdate}>حفظ</button>
      </form>
      {error && <div className="error">{error}</div>}
      {message && <div className="successUpdateMessage">{message}</div>}
    </div>
  );
};

export default UpdateGrade;
