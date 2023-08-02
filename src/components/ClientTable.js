import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import backendURL from '../config';

const ClientTable = () => {
  const [students, setStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { admin } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus]= useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  console.log(backendURL)

  const openPopup = (student) => {
    setSelectedStudent(student);
    setIsOpen(true);
  };
  const onSubmit = () =>{
    setStatus(true);
    setIsOpen(false);
  }

  const closePopup = () => {
    setIsOpen(false);
  };

  const deleteReservation = (reservationId) =>{
    fetch(`${backendURL}/reservation/deleteReservation/${reservationId}`,{
      method:"DELETE",
      headers:{
          Authorization : `Bearer ${admin.token}`
      }
  }).then(res => res.json())
  .then(result=>{
    setIsOpen(false);
      console.log("Reservation Deleted..")
      console.log(result)
  })
}

  const onStatus = (reservationId) =>{
    fetch(`${backendURL}/reservation/updateStatus/${reservationId}`,{
      method:"PATCH",
      headers:{
          Authorization : `Bearer ${admin.token}`
      }
  }).then(res => res.json())
  .then(result=>{
    setIsOpen(false);
      console.log("Status Updated..")
      console.log(result)
  })
}

const offStatus = (reservationId) =>{
  fetch(`${backendURL}/reservation/updateStatusFalse/${reservationId}`,{
    method:"PATCH",
    headers:{
        Authorization : `Bearer ${admin.token}`
    }
}).then(res => res.json())
.then(result=>{
  setIsOpen(false);
    console.log("Status Updated..")
    console.log(result)
})
}

  useEffect(() => {
    fetch(`${backendURL}/reservation/allreservations`, {
      headers: {
        'Authorization': `Bearer ${admin.token}`,
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
      .then(result => {
        console.log("result ", result)
        setStudents(result.student)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [])
  
  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value);
    console.log("You have chosen: ", selectedGrade)
  };

  const filteredStudents = students.filter((student) => {
    if (!selectedGrade) {
      return true && (student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.phone.includes(searchQuery) ||
           student.anotherphone.includes(searchQuery))
    }
    return student.reservations.some((reservation) => reservation.grade === selectedGrade) &&
           (student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.phone.includes(searchQuery) ||
           student.anotherphone.includes(searchQuery))
  });

  return (
    <div className="grade-table-container">
    <div className="grade-select-container">
      <select
        className="grade-select"
        style={{fontSize: "20px"}}
        value={selectedGrade}
        onChange={handleGradeChange}
      >
        <option value="">All</option>
        <option value="Prim 1">Prim 1</option>
        <option value="Prim 2">Prim 2</option>
      </select>
      <label className="grade-select-label" style={{padding: "10px",fontSize: "20px"}}>إختر المرحلة</label>
    </div>
    
    <div>
        <input
          type="text"
          placeholder="Search.."
          className='searchBar'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

    {isOpen && selectedStudent && (
  <div className="popup">
    <div className="popup-content">
      <h2 className='student-name'>{selectedStudent.name}</h2>
      <h3 className='student-grade' style={{fontWeight: "bold"}}>{selectedStudent.reservations[0].grade}</h3>
      <div className='student-modules'>
      <div style={{display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px", fontSize: "18px", color: "red", fontWeight: 'bold'}}>
      <span>المادة</span>
      <span>عدد النسخ</span>
      </div>
        {selectedStudent.reservations[0].modules.map((module, index) => (
          <div key={index}>
            <span>{module}</span>
            <span>{selectedStudent.reservations[0].copiesNumber[index]}</span>
          </div>
        ))}
      </div>
      <button onClick={() => offStatus(selectedStudent.reservations[0]._id)}>لم يستلم</button>
      <button type="submit" onClick={() => onStatus(selectedStudent.reservations[0]._id)}>استلم</button>
      <button type="submit" onClick={() => deleteReservation(selectedStudent.reservations[0]._id)}>إلغاء الحجز</button>
    </div>
  </div>
)}

    <table className="grade-table">
      <thead>
        <tr>
          <th>عدد النسخ</th>
          <th>الاستلام</th>
          <th>المواد</th>
          <th>المرحلة</th>
          <th>الاسم</th>
          <th>الكود</th>
        </tr>
      </thead>
      <tbody>
        {filteredStudents.map((student, index) => (
          <React.Fragment key={index}>
            {student.reservations.map((reservation, i) => (
              <tr key={`${index}-${i}`} className="grade-row">
                <td>
                  <button
                    className='reservation-details'
                    onClick={() => openPopup(student)}
                  >
                    تفاصيل الحجز
                  </button>
                </td>
                <td>{reservation.status}</td>
                <td>{reservation.modules.join(', ')}</td>
                <td>{reservation.grade}</td>
                <td className="studentData">{student.name}</td>
                <td className="studentCode">{reservation.code}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
);
};
export default ClientTable;