import { Outlet } from "react-router-dom"
import Sidebar from "../components/Dashboard/Sidebar/Sidebar"

const DashboardLayout = () => {
  return (
    <div className="relative min-h-screen md:flex bg-gray-50">
      {/* Left Side: Sidebar */}
      <Sidebar />

      {/* Right Side: Dashboard Dynamic Content */}
      <div className="flex-1 md:ml-64 bg-gray-50">
        <div className="p-5">
          {/* Outlet for nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
