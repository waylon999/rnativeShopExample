import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Image } from 'react-native'
import { ProductsDetailsPageProps } from '../navigation/ProductsStack'
import { Product, fetchProductDetails } from '../api/api'
import useCartStore from '../state/cartStore'
import { Ionicons } from '@expo/vector-icons'

const ProductDetails = ( { route }: ProductsDetailsPageProps ) => {
    const { id } = route.params;
    const [product, setProduct] = useState<Product | null>(null);

    const { products, addProduct, removeProduct } = useCartStore((state) => 
        ({
            products: state.products,
            addProduct: state.addProduct,
            removeProduct: state.removeProduct
        })
    );
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
          const productData = await fetchProductDetails(id);
          setProduct(productData);
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
    };

    useEffect(() => {
        console.log('Product Details - updating product quantity');
        udpateProductQuantity();
    }, [products]);

    const udpateProductQuantity = () => {
        const result = products.filter((p) => p.id === id);
        if (result.length > 0) {
            setCount(result[0].quantity);
        } else {
            setCount(0);
        }
    };

    

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
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => removeProduct(product)}>
                    <Ionicons name='remove' size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{count}</Text>
                <TouchableOpacity style={styles.button} onPress={() => addProduct(product)}>
                    <Ionicons name='add' size={24} color="black" />
                </TouchableOpacity>
            </View>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 20
    },
    button: {
        backgroundColor: '#1FE687',
        padding: 10,
        borderRadius: 5
    },
    quantity: {
        fontSize: 24,
        fontWeight: 'bold',
    }

})

export default ProductDetails