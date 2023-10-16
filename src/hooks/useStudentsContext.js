import {useContext} from 'react';
import { StudentsContext } from '../context/StudentsContext';

export const useStudentsContext = () => {
    const context = useContext(StudentsContext);
    if (!context) {
        throw new Error(
            'useStudentContext must be used within a StudentsProvider'
        );
    }
    return context;
};
