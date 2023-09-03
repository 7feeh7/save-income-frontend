import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Income from "./pages/Income"
import Expense from "./pages/Expense"

function Router() {
    return(
        <BrowserRouter>
            <Routes>
                <Route index element={<Login />} />
                <Route index path={"login"} element={<Login />} />
                <Route index path={"register"} element={<Register />} />
                <Route index path={"income"} element={<Income />} />
                <Route index path={"expense"} element={<Expense />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router