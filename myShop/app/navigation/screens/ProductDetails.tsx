import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Image } from 'react-native'
import { ProductsDetailsPageProps } from '../ProductsStack'
import { Product, fetchProduct } from '../../api/api'

const ProductDetails = ( { route }: ProductsDetailsPageProps ) => {
    const { id } = route.params;
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await fetchProduct(id);
            console.log(" here is my data",data);
            setProduct(data);
        }
        load();
    }, []);

    if (!product) {
       return (
        <View style={styles.container}>
            <Text>Item Not Found</Text>
        </View>
       ) 
    }
    return (
        <View style={styles.container}>
            <Text style={styles.productTitle}>{product.product_name}</Text>
            <Image source={{ uri: product.product_image }} style={styles.productImage} />
            <Text style={styles.productCategory}>Category: {product.product_category}</Text>
            <Text style={styles.productDescription}>{product.product_description}</Text>
            <Text style={styles.productPrice}>Price: ${product.product_price.toFixed(2)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        marginTop: 50
    },
    productImage: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        borderRadius: 10,
    },
    productTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    }, 
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        margin: 10
    },
    productCategory: {
        fontSize: 14,
        margin: 10,
        color: '#555'
    },
    productDescription: {
        fontSize: 14,
    },

})

export default ProductDetails