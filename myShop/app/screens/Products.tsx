import { View, Text, FlatList, StyleSheet, TouchableOpacity, ListRenderItem } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Product, fetchProducts } from '../api/api';
import { ProductsPageProps } from '../navigation/ProductsStack';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Products = ({ navigation }: ProductsPageProps ) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
        const data = await fetchProducts();
        setProducts(data);
    }
    load();
  }, []);

  const renderProductItem: ListRenderItem<Product> = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productBox} onPress={() => navigation.navigate('ProductDetails', { id: item.id })}>
        <Image source={{ uri: item.product_image }} style={styles.productImage} />
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.productPrice}>${item.product_price.toFixed(2)}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
        <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={renderProductItem}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',

    },
    productBox: {
        flex: 1,
        backgroundColor: 'lightgray',
        padding: 16,
        margin: 8,
        borderRadius: 8,
      },
      productName: {
        fontSize: 12,
        fontWeight: 'bold',
      },
      productPrice: {
        fontSize: 10,
      },
      productDescription: {
        fontSize: 14,
      },
      productCategory: {
        fontSize: 14,
        fontWeight: 'bold',
      },
      productImage: {
         width: 100,
         height: 100, 
      }
})

export default Products
