import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import backendURL from '../config';

const GradeTable = () => {
  const [grades, setGrades] = useState([]);
  const [selectedModules, setSelectedModules] = useState({});
  const { admin } = useAuthContext();

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

  const handleModuleChange = (gradeId) => (event) => {
    const moduleId = event.target.value;
    setSelectedModules(prevState => ({
      ...prevState,
      [gradeId]: moduleId,
    }));
  };

  return (
    <div className="grade-table-container">
      <h2 className="grade-heading">أعداد الطباعة</h2>
      <table className="grade-table">
        <thead>
          <tr>
            <th>طباعة</th>
            <th>سعر البوكليت</th>
            <th>عدد الحجز</th>
            <th>سعر المادة</th>
            <th>المادة</th>
            <th>المرحلة</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
              <tr className='grade-row' key={grade._id}>
                {console.log("grade._id :",grade._id)}
              <td>{selectedModules[grade._id] && grade.modules.find(module => module._id === selectedModules[grade._id])?.stock}</td>
              <td>{grade.balance}</td>
              <td>
                  {selectedModules[grade._id] && grade.modules.find(module => module._id === selectedModules[grade._id])?.reservationCount}
              </td>
              <td className='reserverdCount'>
                {selectedModules[grade._id] && grade.modules.find(module => module._id === selectedModules[grade._id])?.price}
              </td>
              <td>
                <select
                  value={selectedModules[grade._id] || ''}
                  onChange={handleModuleChange(grade._id)}
                >
                  <option value="">اختار المادة</option>
                  {grade.modules.map((module) => (
                    <option key={module._id} value={module._id}>
                      {module.moduleName}
                    </option>
                  ))}
                </select>
              </td>
              <td>{grade.gradeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeTable;