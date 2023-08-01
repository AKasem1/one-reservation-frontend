import { useState } from "react"
import { useLogin } from "../hooks/useLogin"

const Login = () =>{
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {login, isLoading, error} = useLogin()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        login(username, password)
    }

    return(
        <form className="login-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column'}}>
            <h3 className="login-heading">LOG IN</h3>
            <label className="login-label">Username</label>
            <input 
            type="username"
            className="login-input"
            onChange={e => setUsername(e.target.value)}
            value={username}
            ></input>
            <label className="login-label">Password</label>
            <input 
            type="password"
            className="login-input"
            onChange={e => setPassword(e.target.value)}
            value={password}
            ></input>
            <button disabled={isLoading} style={{marginTop: "10px"}} className="login-button">Log in</button>
            {error && <div className="login-error">{error}</div>}
        </form>
    )
}
export default Login