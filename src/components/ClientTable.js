import React, { useState, useEffect, useRef } from 'react'; 
import { useAuthContext } from '../hooks/useAuthContext';
import backendURL from '../config';
//this line is test for deployment
const ClientTable = () => {
  const [students, setStudents] = useState([]);
  //const [filteredStudents, setFilteredStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  //let selectedGrade = ''
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const { admin } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus]= useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  console.log(backendURL)
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
        console.error('Error fetching data:', error);
      });
  }, [])

  const openPopup = (student, id) => {
    setSelectedStudent(student);
    setSelectedReservationId(id);
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

    setSelectedGrade (event.target.value);
    console.log("You have chosen: ", selectedGrade);
    filterrrr(event.target.value)
  };

  const filterrrr = (selectedGrade) => {
    fetch(`${backendURL}/reservation/selectedGrade/${selectedGrade}`, {
      headers: {
        'Authorization': `Bearer ${admin.token}`,
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
    .then(result => {
      //setFilteredStudents(result)
      console.log("selected grade result: ", result)
      setStudents(result.reservations)

    }).catch((error) => {
      console.error('Error fetching selected grade:', error);
    });
  }
  const filteredStudents = students.filter((student) => {
    if (!selectedGrade) {
      return true && (student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.phone.includes(searchQuery) ||
           student.anotherphone.includes(searchQuery))
    }
    console.log("Selected Grade is: :", selectedGrade)
    return student.reservations.some((reservation) => reservation.grade === selectedGrade) &&
           (student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.phone.includes(searchQuery) ||
           student.anotherphone.includes(searchQuery))
  });

  //console.log("filteredStudents: ", filteredStudents)
  console.log("Students: ", students)

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
        {grades.map((g) => (
              <option key={g._id} value={g.gradeName}>{g.gradeName}</option>
            ))}
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
    <button className="popup-close-button" onClick={closePopup}>X</button>
      <h2 className='student-name'>{selectedStudent.name}</h2>
      <h2 className='student-name'>{selectedStudent.phone}</h2>
      <h2 className='student-name'>{selectedStudent.address}</h2>
      {selectedStudent.reservations.map((reservation, index) => (
        <React.Fragment key={index}>
          {reservation._id === selectedReservationId && (
            <React.Fragment>
              <h3 className='student-grade' style={{fontWeight: "bold"}}>{reservation.grade}</h3>
              <div className='student-modules'>
                <div style={{display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px", fontSize: "18px", color: "red", fontWeight: 'bold'}}>
                  <span>المادة</span>
                  <span>عدد النسخ</span>
                </div>
                {reservation.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex}>
                    <span>{module}</span>
                    <span>{reservation.copiesNumber[moduleIndex]}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => offStatus(reservation._id)}>لم يستلم</button>
              <button type="submit" onClick={() => onStatus(reservation._id)}>استلم</button>
              <button type="submit" onClick={() => deleteReservation(reservation._id)}>إلغاء الحجز</button>
            </React.Fragment>
          )}
        </React.Fragment>
      ))}
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
        { filteredStudents ?
        filteredStudents.map((student, index) => (
          <React.Fragment key={index}>
            {student.reservations.map((reservation, i) => (
              <tr key={`${index}-${i}`} className="grade-row">
                <td>
                  <button
                    className='reservation-details'
                    onClick={() => openPopup(student, reservation._id)}
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
        ))
        : students.map((student, index) => (
          <React.Fragment key={index}>
            {student.reservations.map((reservation, i) => (
              <tr key={`${index}-${i}`} className="grade-row">
                <td>
                  <button
                    className='reservation-details'
                    onClick={() => openPopup(student, reservation._id)}
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