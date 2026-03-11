import { Outlet } from "react-router";
import Header from "../shared/ui/Header";
import Main from "../shared/ui/Main";
import Footer from "../shared/ui/Footer";

export default function RootLayout() {
  return (
    <div id="root">
      <Header />
      <Main className="flex flex-col justify-center items-center">
        <Outlet />
      </Main>
      <Footer />
    </div>
  );
}
