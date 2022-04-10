import Head from "next/head";
import products from "../../products.json";
import styles from "../../styles/Product.module.css";
import { useCart } from "../../hooks/use-cart";

export default function Product({ product }) {
  const { addToCart } = useCart();
  const { id, title, description, image, price } = product;

  return (
    <>
      <Head>
        <title>Product: {title}</title>
      </Head>
      <main className={styles.main}>
        <img src={image} alt={title} />
        <div className={styles.productInfo}>
          <h1>{title}</h1>
          <p>{description}</p>
          <p>$ {price.toFixed(2)}</p>
          <button className={styles.button} onClick={() => addToCart({ id })}>
            Add to cart
          </button>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps({ params }) {
  const product = products.find(
    ({ id: productId }) => productId === params.productId
  );
  return {
    props: { product },
  };
}

export async function getStaticPaths() {
  const paths = products.map((product) => {
    return {
      params: {
        productId: product.id,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
