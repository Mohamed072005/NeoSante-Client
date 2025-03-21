import DashboardGuard from "@/lib/guards/DashboardGuard";

interface DashboardLayoutProps {
    children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    console.log("DashboardLayout");
    return (
        <>
            <DashboardGuard>
                { children }
            </DashboardGuard>
        </>
    )
}

export default DashboardLayout;