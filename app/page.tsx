import ClientBread from "./components/client/ClientBread";
import ClientBread2 from "./components/client/ClientBread2";
import ClientNavbar from "./components/client/ClientNavbar";

export default function Home() {
  return (
    <div>
      <ClientNavbar />
      <ClientBread />
      <ClientBread2 />
    </div>
  );
}
