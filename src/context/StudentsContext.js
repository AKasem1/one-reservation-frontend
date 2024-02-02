import {createContext, useReducer} from 'react';

export const StudentsContext = createContext();

export const studentsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STUDENT':
            return { ...state, student: action.payload };
        case 'CREATE_STUDENT':
            return { ...state, student: action.payload };
        case 'DELETE_STUDENT':
            const {deletedStudent, reservationID, deletedStudentID } = action.payload;
            console.log('action payload: ', action.payload);
            console.log('state.student: ', state.student);
            console.log('deleted student Redux: ', deletedStudent);
            console.log('deleted student ID Redux: ', deletedStudentID);
            console.log('state.student.reservations: ', state.student[0].reservations);
            return {
                ...state,
                student: state.student.map((student) => {
                    if (student._id === deletedStudentID) {
                        return {
                            ...student,
                            reservations: student.reservations.filter((reservation) => reservation._id !== reservationID),
                        };
                    }
                    return student;
                }),
            }
        case 'TOGGLE_STATUS':
            const { reservationId, newStatus } = action.payload;
            const selectedStudent = action.payload.student;
            console.log('action payload: ', action.payload);
            console.log('state.student: ', state.student);
            console.log('selected student: ', selectedStudent);
            console.log('state.student.reservations: ', state.student[0].reservations);
            return {
                ...state,
                student: state.student.map((student) => {
                    if (student._id === selectedStudent._id) {
                        // Update reservations only for the selected student
                        return {
                            ...student,
                            reservations: student.reservations.map((reservation) =>
                                reservation._id === reservationId
                                    ? { ...reservation, status: newStatus }
                                    : reservation
                            ),
                        };
                    }
                    return student;
                }),
            };
           
        default:
            return state;
    }
};

export const StudentsContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(studentsReducer, {
        student: [],
    })
    
    return (
        <StudentsContext.Provider value={{...state, dispatch}}>
            {children}
        </StudentsContext.Provider>
    )
}