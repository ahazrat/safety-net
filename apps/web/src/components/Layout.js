import { Outlet } from "react-router-dom"
import DrawerFS from './DrawerFS'

const Layout = () => {
  return (
    <div style={{
      marginLeft: 0,
    }}>
      <DrawerFS />
      <Outlet />
    </div>
  )
};

export default Layout;
