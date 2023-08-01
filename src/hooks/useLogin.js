import { useState } from "react";
import {useAuthContext} from './useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()
    

    const login = (username, password) => {
        setIsLoading(true);
        setError(null);
        
        fetch('/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
          .then(response => {
            console.log(response);
            return response.json();
          })
          .then(json => {
            if (!json.ok) {
              setError(json.error);
              console.log("Cannot log in");
              setIsLoading(false);
            } else {
              //save the user to local storage
              localStorage.setItem('jwt', JSON.stringify(json.token));
              localStorage.setItem('admin', JSON.stringify(json));
              //update the auth context
              dispatch({ type: 'LOGIN', payload: json });
              setIsLoading(false);
            }
          })
          .catch(error => {
            console.error('Error in login:', error);
            setError('Server error');
            setIsLoading(false);
          });
      };
      
      return { login, isLoading, error };
}