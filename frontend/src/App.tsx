import type { ReactElement } from "react";
import Header from "./components/Header";
import ProductDetailPage from "./components/ProductDetailPage";

export default function App(): ReactElement {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <ProductDetailPage productId="aurora-h1" />
      </main>
      <footer className="footer">
        <span>Aurora Audio &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
