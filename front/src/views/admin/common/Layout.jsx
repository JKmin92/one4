import { Outlet, Navigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import SideMenu from "./SideMenu";
import { Box } from "@chakra-ui/react";
import { useAuth } from "../../../utils/useAuth";

function Layout() {
    const { user } = useAuth();

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <>
        <SideMenu />
        <Box marginLeft="18rem">
            <Header />
                <Outlet />
            <Footer />
        </Box>
        </>
    )
}

export default Layout;