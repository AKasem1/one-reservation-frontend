import { useState } from "react";
import {useAuthContext} from './useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()
    

    const login = async (username, password) => {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/admin/login',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        console.log(response)
        const json = await response.json()
        if(!response.ok){
            setError(json.error)
            console.log("Cannot log in")
            setIsLoading(false)
        }
        else{
            //save the user to a local storage
            localStorage.setItem('jwt', JSON.stringify(json.token))
            localStorage.setItem('admin', JSON.stringify(json))
            //update the auth context
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
        }
    }
    return {login, isLoading, error}
}