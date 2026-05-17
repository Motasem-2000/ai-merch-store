import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/cartStore';

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds an item to the cart', () => {
    useCartStore.getState().addItem({
      id: '1',
      name: 'Test Product',
      price: 29.99,
      image_url: null,
    });

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Test Product');
    expect(items[0].quantity).toBe(1);
  });

  it('increments quantity when adding the same item twice', () => {
    const item = { id: '1', name: 'Test Product', price: 29.99, image_url: null };
    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem(item);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('removes an item from the cart', () => {
    useCartStore.getState().addItem({
      id: '1',
      name: 'Test Product',
      price: 29.99,
      image_url: null,
    });
    useCartStore.getState().removeItem('1');

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('updates quantity', () => {
    useCartStore.getState().addItem({
      id: '1',
      name: 'Test Product',
      price: 29.99,
      image_url: null,
    });
    useCartStore.getState().updateQuantity('1', 5);

    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('removes item when quantity set to 0', () => {
    useCartStore.getState().addItem({
      id: '1',
      name: 'Test Product',
      price: 29.99,
      image_url: null,
    });
    useCartStore.getState().updateQuantity('1', 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clears the cart', () => {
    useCartStore.getState().addItem({ id: '1', name: 'A', price: 10, image_url: null });
    useCartStore.getState().addItem({ id: '2', name: 'B', price: 20, image_url: null });
    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('calculates total items correctly', () => {
    useCartStore.getState().addItem({ id: '1', name: 'A', price: 10, image_url: null });
    useCartStore.getState().addItem({ id: '2', name: 'B', price: 20, image_url: null });
    useCartStore.getState().updateQuantity('1', 3);

    expect(useCartStore.getState().totalItems()).toBe(4);
  });

  it('calculates total price correctly', () => {
    useCartStore.getState().addItem({ id: '1', name: 'A', price: 10, image_url: null });
    useCartStore.getState().addItem({ id: '2', name: 'B', price: 20, image_url: null });
    useCartStore.getState().updateQuantity('1', 2);

    expect(useCartStore.getState().totalPrice()).toBe(40);
  });
});
