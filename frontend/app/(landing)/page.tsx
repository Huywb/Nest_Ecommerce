import Image from "next/image";
import Header from "../components/modules/landing/Header";
import Footer from "../components/modules/landing/Footer";
import ProductList from "../components/modules/landing/ProductList";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">
        <ProductList />
      </main>
      <Footer />
    </>
  );
}
