import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Product, fetchProducts } from '../../api/api';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
        const data = await fetchProducts();
        console.log(" here is my data",data);
        setProducts(data);
    }
    load();
  }, []);

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productBox}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.productPrice}>{item.product_price}</Text>
        <Text style={styles.productCategory}>{item.product_category}</Text>
        <Text style={styles.productDescription}>{item.product_description}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
        <FlatList
            data={products}
            renderItem={renderProductItem}
        />

      <Text>Products</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',

    },
    productBox: {
        backgroundColor: 'lightgray',
        padding: 16,
        margin: 8,
        borderRadius: 8,
      },
      productName: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      productPrice: {
        fontSize: 16,
      },
      productDescription: {
        fontSize: 14,
      },
      productCategory: {
        fontSize: 14,
        fontWeight: 'bold',
      }
})

export default Products
