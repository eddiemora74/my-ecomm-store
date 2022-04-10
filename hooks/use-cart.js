import { createContext, useContext, useEffect, useState } from "react";
import { initiatePayment } from "../lib/payments";
import products from "../products.json";

export const CartContext = createContext();

const defaultCart = {
  products: {},
};

export function useCartState() {
  const [cart, updateCart] = useState(defaultCart);

  useEffect(() => {
    try {
      const storageState = window.localStorage.getItem("spacejelly_cart");
      const data = storageState && JSON.parse(storageState);
      data && updateCart(data);
    } catch (err) {
      console.info("No storage state, keeping empty cart...");
    }
  }, []);

  useEffect(() => {
    const data = JSON.stringify(cart);
    window.localStorage.setItem("spacejelly_cart", data);
  }, [cart]);

  const cartItems = Object.keys(cart.products).map((key) => {
    const product = products.find(({ id }) => id === key);

    return {
      ...cart.products[key],
      name: product.title,
      pricePerItem: product.price,
    };
  });

  const subTotal = cartItems.reduce(
    (accumulator, { pricePerItem, quantity }) => {
      return accumulator + pricePerItem * quantity;
    },
    0
  );

  const quantity = cartItems.reduce((accumulator, { quantity }) => {
    return accumulator + quantity;
  }, 0);

  function addToCart({ id } = {}) {
    updateCart((prev) => {
      let cartState = { ...prev };

      if (cartState.products[id]) {
        cartState.products[id].quantity = cartState.products[id].quantity + 1;
      } else {
        cartState.products[id] = { id, quantity: 1 };
      }

      return cartState;
    });
  }

  function updateQuantity({ id, quantity } = {}) {
    updateCart((prev) => {
      let cartState = { ...prev };

      if (cartState.products[id]) {
        if (quantity > 0) {
          cartState.products[id].quantity = quantity;
        } else {
          delete cartState.products[id];
        }
      }

      return cartState;
    });
  }

  function checkout() {
    initiatePayment({
      lineItems: cartItems.map((item) => {
        const { id: price, quantity } = item;
        return { price, quantity };
      }),
    });
  }

  return {
    cart,
    cartItems,
    updateCart,
    subTotal,
    quantity,
    addToCart,
    updateQuantity,
    checkout,
  };
}

export function useCart() {
  return useContext(CartContext);
}
