import { FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Order, createOrder } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../navigation/ProductsStack';
import useCartStore from '../state/cartStore';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartModal = () => {
  const { products, total, removeProduct, addProduct, clearCart } = useCartStore((state) => ({
    products: state.products,
    total: state.total,
    removeProduct: state.removeProduct,
    addProduct: state.addProduct,
    clearCart: state.clearCart
  }));

  // just using a stupid email
  const [email, setEmail] = useState('test@example.com');
  const [order, setOrder] = useState<Order | null>(null);
  const navigation = useNavigation<StackNavigation>();
  const [submitting, setSubmitting] = useState(false);
  
  const onSubmitOrder = async () => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    Keyboard.dismiss();
    // can probably move this into the try/catch block
    if (!email) {
      setSubmitting(false);
      return;
    }
    try {
      const orderData = {
        email: email,
        // only send back relevant information
        products: products.map((product) => {
          return {
            product_id: product.id,
            quantity: product.quantity
          }
        })
      }
      const response = await createOrder(orderData);
      setOrder(response);
      clearCart();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.cartTitle}>Your Cart</Text>
    {products.length === 0  && <Text>Your cart is empty</Text>}
      <FlatList
      style={{ flexGrow: 0 }}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItemContainer}>
            <Image source={{ uri: item.product_image }} style={styles.cartItemImage} />
            <View style={styles.itemContainer}>
              <Text style={styles.cartItemName}>{item.product_name}</Text>
              <Text style={styles.cartItemPrice}>${item.product_price.toFixed(2)}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => removeProduct(item)}>
                <Ionicons name="remove" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => addProduct(item)}>
                <Ionicons name="add" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        />
        <Text style={styles.cartTotal}>Total: ${total.toFixed(2)}</Text>
        <TextInput style={styles.emailInput} placeholder="Enter Your Email" value={email} onChangeText={setEmail} />
        <TouchableOpacity style={[styles.submitButton, email === '' ? styles.inactive : null]} onPress={onSubmitOrder} disabled={email === '' || submitting}>
            <Text style={styles.submitButtonText}>{submitting ? 'Creating Order...' : 'Submit Order'}</Text>
          </TouchableOpacity>
  </View>
  )
}

export default CartModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: 'contain',
  },
  cartItemName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartItemQuantity: {
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#1FE687',
    padding: 5,
    width: 30,
    color: '#fff',
    textAlign: 'center',
  },
  itemContainer: {
    flex: 1,
  },
  cartItemPrice: {
    fontSize: 11,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#1FE687',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  inactive: {
    opacity: 0.5,
  },
})