import {createContext, useReducer} from 'react';

export const StudentsContext = createContext();

export const studentsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STUDENT':
            return {...state.student, student: action.payload}
        case 'CREATE_STUDENT':
            return {...state, student: [action.payload, ...state.student]}
            default: return state
    }
}

export const StudentsContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(studentsReducer, {
        student: null
    })
    
    return (
        <StudentsContext.Provider value={{...state, dispatch}}>
            {children}
        </StudentsContext.Provider>
    )
}