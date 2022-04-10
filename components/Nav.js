import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import styles from "../styles/Nav.module.css";
import { useCart } from "../hooks/use-cart";

export default function Nav() {
  const { subTotal } = useCart();
  return (
    <nav className={styles.nav}>
      <h1>
        <Link href="/">
          <a>Space Jelly Shop</a>
        </Link>
      </h1>
      <div className={styles.button}>
        <Link href="/cart">
          <a>
            <FaShoppingCart />
            <span>$ {subTotal.toFixed(2)}</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
