import { Link } from "react-router-dom"
import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const NavBar = () => {
  const {admin} = useAuthContext()

return(
        <header>
            <div className="container">
            <Link to="/">
                <img src="https://i.ibb.co/gdpS0qK/one.png" alt="one"  className="logo"></img>
            </Link>
            <nav>
                <div className="navLinks">
                    <div>
                        <Link className="Links" to="/updateGrade">تعديل مادة</Link>
                        <Link className="Links" to="/">حجز جديد</Link>
                        <Link className="Links" to="/allGrades">أعداد الطباعة</Link>
                        <Link className="Links" to="/reservations">قائمة الحجوزات</Link>
                    </div>
                    
                </div>
            </nav>
            </div>

        </header>
        
    )
}
export default NavBar