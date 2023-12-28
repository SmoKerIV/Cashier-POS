import Link from "next/link";
import AppContainer from "../Container/container";
import styles from "./header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <AppContainer width={1300}>
        <div className={styles.content}>
          <h1>Logo</h1>
          <ul>
            <li>
              <Link href={"http://localhost:3000/"}>Home</Link>
            </li>

            <li>
              <Link href={"/products"}>Products</Link>
            </li>

            <li>
              <Link href={"/category"}>Categories</Link>
            </li>

            <li>
              <Link href={"/invoices"}>Invoices</Link>
            </li>
          </ul>
        </div>
      </AppContainer>
    </div>
  );
};

export default Header;
