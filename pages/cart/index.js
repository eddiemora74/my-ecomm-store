import Head from "next/head";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { useCart } from "../../hooks/use-cart";
import styles from "../../styles/Cart.module.css";
import { useState } from "react";

const tableHeader = ["Product Name", "Quantity", "Unit Price", "Line Total"];

export default function Cart() {
  const { cartItems, checkout, updateQuantity } = useCart();

  const data = cartItems.map((item) => {
    const Quantity = () => {
      const [buttonState, setButtonState] = useState(true);

      function handleSubmit(e) {
        e.preventDefault();
        const newQuantity = e.currentTarget.querySelector("input")?.value;

        if (newQuantity !== null) {
          const id = item.id;
          updateQuantity({ id, quantity: parseInt(newQuantity, 10) });
        }
        setButtonState(true);
      }

      const quantity = item.quantity;

      return (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="number"
            min={0}
            defaultValue={quantity}
            onChange={() => setButtonState(false)}
          />
          <button disabled={buttonState}>
            <FaCheck />
          </button>
        </form>
      );
    };

    return {
      ...item,
      quantityInput: <Quantity />,
    };
  });

  return (
    <>
      <Head>
        <title>Shopping Cart</title>
      </Head>
      <main className={styles.main}>
        <h1>
          <FaShoppingCart /> Cart
        </h1>
        {data.length ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  {tableHeader.map((header, idx) => (
                    <th key={idx}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantityInput}</td>
                    <td>$ {item.pricePerItem.toFixed(2)}</td>
                    <td>$ {(item.pricePerItem * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className={styles.button} onClick={checkout}>
              Checkout
            </button>
          </>
        ) : (
          <p>No items.</p>
        )}
      </main>
    </>
  );
}
