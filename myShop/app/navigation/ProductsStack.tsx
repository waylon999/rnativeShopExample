import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Products from './screens/Products';

type ProductsStackParamList = {
    Products: undefined;
    ProductDetails: { id: number };
    // TODO: Cart modal
}



const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();

const ProductsStackNav = () => {
    return (
        <ProductsStack.Navigator
            screenOptions={{ 
                headerStyle: {
                    backgroundColor: '#1FE687'
                },
                headerTintColor: '#141414', 
            }}
        >
            <ProductsStack.Screen 
                name="Products" 
                component={Products} 
                options={{ headerTitle: 'The Shop' }} 
            />
        </ProductsStack.Navigator>
    )
}

export default ProductsStackNav;