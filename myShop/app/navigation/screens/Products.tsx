import { View, Text } from 'react-native'
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
    console.log('RUNNING');
    load();
  }, []);

  return (
    <View>
      <Text>Products</Text>
    </View>
  )
}

export default Products
