
import { AppFooter } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { CourseCatalog } from "@/components/courses/CourseCatalog";

export default function CoursesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
                <CourseCatalog />
            </main>
            <AppFooter />
        </div>
    )
}
