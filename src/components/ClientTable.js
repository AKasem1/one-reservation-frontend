import React, { useState, useEffect, useRef } from 'react'; 
import { useAuthContext } from '../hooks/useAuthContext';
import { useStudentsContext } from '../hooks/useStudentsContext';
import { toggleReservationStatus } from '../hooks/studentsActions';
import backendURL from '../config';

//this line is test for deployment
const ClientTable = () => {
  const [students, setStudents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [grades, setGrades] = useState([]);
  //let selectedGrade = ''
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const { admin } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {student, dispatch} = useStudentsContext();

  const [totalReservations, setTotalReservations] = useState(0);
  let reservationsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(1);
  const lastIndex = currentPage * reservationsPerPage;
  console.log("lastIndex:", lastIndex);
  const firstIndex = lastIndex - reservationsPerPage;
  console.log("firstIndex:", firstIndex);
  console.log("totalReservations:", totalReservations);
  const npage = Math.ceil(totalReservations / reservationsPerPage);
  console.log("npage:", npage);
  const range = 5;
  const startPage = Math.max(1, currentPage - Math.floor(range / 2));
  const endPage = Math.min(npage, startPage + range - 1);

  // Generate an array of page numbers within the calculated range
  const numbers = [...Array(endPage - startPage + 1).keys()].map((i) => startPage + i);
  console.log("numbers:", numbers);

  
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

  const openPopup = (s, id) => {
    setSelectedStudent(s);
    setSelectedReservationId(id);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const deleteReservation = (deletedStudent, reservationId) =>{
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
      console.log("deletedStudent: ", deletedStudent)
      console.log("deletedStudent id: ", deletedStudent._id)
      const reservationID = reservationId
      const deletedStudentID = deletedStudent._id
      dispatch({ type: 'DELETE_STUDENT', payload: { deletedStudent, reservationID, deletedStudentID} });
  })
}

  const toggleStatus = (selectedStudent, id, status) =>{
    fetch(`${backendURL}/reservation/updateStatus`,{
      method:"POST",
      headers:{
        'Content-Type': 'application/json',
        Authorization : `Bearer ${admin.token}`},
        body: JSON.stringify({id, status})
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then(result=>{
    console.log('Full result from server:', result);
    console.log("id: ", id)
    console.log("student: ", selectedStudent)
    console.log("Status: ", status)
    dispatch(toggleReservationStatus(selectedStudent, id, status));
    console.log("Status Updated..")
    console.log(result)
    setIsOpen(false);
  })
  .catch((error) => {
    console.error('Error updating reservation status:', error);
  });
}
  useEffect(() => {
    fetch(`${backendURL}/reservation/allreservations?reservationsPerPage=${reservationsPerPage}&currentPage=${currentPage}`, {
      method:"GET",
      headers: {
        'Authorization': `Bearer ${admin.token}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(result => {
        console.log("result of all students: ", result.student)
        console.log("result of total reservations: ", result.totalReservations)
        dispatch({ type: 'SET_STUDENT', payload: result.student });
        setTotalReservations(result.totalReservations);
        setStudents(result.student)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [currentPage])

  useEffect(() => {
    console.log("Redux state updated:", students);
    console.log("Updated Student state:", students[0]);
    setStudents(student);
  }, [student]);


  const handleGradeChange = (event) => {

    setSelectedGrade (event.target.value);
    console.log("You have chosen: ", selectedGrade);
    filterrrr(event.target.value)
  };

  const prePage = () =>{
    if(currentPage !== 1){
      setCurrentPage(currentPage - 1)
    }
  }
  const nextPage = () =>{
    if(currentPage !== npage){
      setCurrentPage(currentPage + 1)
    }
  }
  const changeCPage = (id) =>{
    setCurrentPage(id)
  }

  console.log("current page: ", currentPage)

  const filterrrr = (selectedGrade) => {
    if(selectedGrade === ''){
      setStudents(student)
    }
    else{
      fetch(`${backendURL}/reservation/selectedGrade/${selectedGrade}`, {
        headers: {
          'Authorization': `Bearer ${admin.token}`,
          'Content-Type': 'application/json'
        },
      }).then(res => res.json())
      .then(result => {
        console.log("selected grade result: ", result)
        setStudents(result.reservations)
  
      }).catch((error) => {
        console.error('Error fetching selected grade:', error);
      });
    }
    }
    const handleSearch = async (value) => {
      try {
        const response = await  fetch(`${backendURL}/reservation/search?query=${value}`);
        const data = await response.json();
        setSearchQuery(value);
        setSearchResults(data.results);
        console.log("Search results: ", data.results)
      } catch (error) {
        console.error('Error in fetching search results:', error);
      }
    };
    
  console.log("Students before filtering: :", students)
  console.log("student rendered from state: ", student) 
  const filteredStudents = !selectedGrade && searchQuery
  ? searchResults
  : students.filter((student) => {
      console.log("Selected Grade is:", selectedGrade);
      return (
        student.reservations.some((reservation) => reservation.grade === selectedGrade) &&
        (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.phone.includes(searchQuery) ||
          student.anotherphone.includes(searchQuery)) ||
        student.reservations.some((reservation) => reservation.code.includes(searchQuery))
      );
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
          onChange={(e) => {handleSearch(e.target.value); setSearchQuery(e.target.value)}}
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
              <button onClick={() => toggleStatus(selectedStudent, 
              reservation._id,
              reservation.status === 'استلم' ? 'لم يستلم' : 'استلم')}>
              {reservation.status === 'استلم' ? 'لم يستلم' : 'استلم'}</button>
              {/* <button type="submit" onClick={() => onStatus(reservation._id)}>استلم</button> */}
              <button type="submit" onClick={() => deleteReservation(selectedStudent,reservation._id)}>إلغاء الحجز</button>
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
        : student.map((s, index) => (
          <React.Fragment key={index}>
            {s.reservations.map((reservation, i) => (
              <tr key={`${index}-${i}`} className="grade-row">
                <td>
                  <button
                    className='reservation-details'
                    onClick={() => openPopup(s, reservation._id)}
                  >
                    تفاصيل الحجز
                  </button>
                </td>
                <td>{reservation.status}</td>
                <td>{reservation.modules.join(', ')}</td>
                <td>{reservation.grade}</td>
                <td className="studentData">{s.name}</td>
                <td className="studentCode">{reservation.code}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
    {!selectedGrade && (
      <nav>
        <ul className="pagination">
          <li className="page-item">
            <a href='#' className='page-link' onClick={prePage}>Prev</a>
          </li>
          {numbers.map((n, i) => (
            <li key={i} className={`page-item ${currentPage === n ? 'active' : ''}`}>
              <a onClick={() => changeCPage(n)} href="#" className="page-link">
                {n}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a href='#' className='page-link' onClick={nextPage}>Next</a>
          </li>
        </ul>
      </nav>
    )}
    
  </div>
);
};
export default ClientTable;