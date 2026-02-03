import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import SideMenu from "./SideMenu";
import { Box } from "@chakra-ui/react";

function Layout() {
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