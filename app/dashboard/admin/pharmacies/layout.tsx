import {PharmaciesProvider} from "@/context/PharmaciesContext";

interface LayoutProps {
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <PharmaciesProvider>
                { children }
            </PharmaciesProvider>
        </>
    )
}

export default Layout;