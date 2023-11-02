import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import Products from '../screens/Products';
import ProductDetails from '../screens/ProductDetails';
import useCartStore from '../state/cartStore';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import CartModal from '../screens/CartModal';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

type ProductsStackParamList = {
    Products: undefined;
    ProductDetails: { id: number };
    CartModal: undefined; // we pass no information to this screen
}

// typeScript things!!
const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();
export type ProductsPageProps = NativeStackScreenProps<ProductsStackParamList, 'Products'>;   
export type ProductsDetailsPageProps = NativeStackScreenProps<ProductsStackParamList, 'ProductDetails'>;
export type StackNavigation = NavigationProp<ProductsStackParamList>;

const ProductsStackNav = () => {
    return (
        <ProductsStack.Navigator
            screenOptions={{ 
                headerStyle: {
                    backgroundColor: '#1FE687'
                },
                headerTintColor: '#141414', 
                headerRight: () => <CartButton />,
            }}
        >
            <ProductsStack.Screen 
                name="Products" 
                component={Products} 
                options={{ headerTitle: 'The Shop' }} 
            />
            <ProductsStack.Screen 
                name="ProductDetails" 
                component={ProductDetails} 
                options={{ headerTitle: 'The Shop' }} 
            />
            <ProductsStack.Screen 
                name="CartModal" 
                component={CartModal} 
                options={{ headerShown: false, presentation: 'modal' }} 
            />
        </ProductsStack.Navigator>
    )
}

const CartButton = () => {
    const navigation = useNavigation<StackNavigation>();
    const { products } = useCartStore((state) => ({
        products: state.products
    }));

    const [count, setCount] = useState(0);
    useEffect(() => {
        console.log('product stack - updating products (count)')
        // loop through products and total up the quantity
        const sum = products.reduce((total, product) => total + product.quantity, 0);
        setCount(sum);
    }, [products]);
    return (
        <TouchableOpacity onPress={() => navigation.navigate('CartModal')}>
            <View style={styles.countContainer}>
                <Text style={styles.countText}>{ count }</Text>
            </View>
            <Ionicons name="cart" size={28} color="black" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    countContainer: {
      position: 'absolute',
      zIndex: 1,
      bottom: -5,
      right: -10,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    countText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  });
  

export default ProductsStackNav;