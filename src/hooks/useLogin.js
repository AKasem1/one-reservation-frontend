import { useState } from "react";
import {useAuthContext} from './useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()
    

    const login = async (username, password) => {
        setIsLoading(true)
        setError(null)
        try {
          const response = await fetch('https://one-reservation-system.onrender.com/admin/login',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        console.log(response)
        const json = await response.json()
        if(response.ok){
            localStorage.setItem('jwt', JSON.stringify(json.token))
            localStorage.setItem('admin', JSON.stringify(json))
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
        }
      else {
            console.log("Cannot log in")
            const errorData = await response.json();
            setError(errorData.error);
            setIsLoading(false);
        }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
        
    }
    return {login, isLoading, error}
}