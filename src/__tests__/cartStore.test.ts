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

  it('removes item when quantity set to negative', () => {
    useCartStore.getState().addItem({
      id: '1',
      name: 'Test Product',
      price: 29.99,
      image_url: null,
    });
    useCartStore.getState().updateQuantity('1', -1);

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

  it('handles adding multiple different items', () => {
    useCartStore.getState().addItem({ id: '1', name: 'A', price: 10, image_url: null });
    useCartStore.getState().addItem({ id: '2', name: 'B', price: 20, image_url: null });
    useCartStore.getState().addItem({ id: '3', name: 'C', price: 30, image_url: null });

    expect(useCartStore.getState().items).toHaveLength(3);
    expect(useCartStore.getState().totalItems()).toBe(3);
    expect(useCartStore.getState().totalPrice()).toBe(60);
  });

  it('handles removing a non-existent item gracefully', () => {
    useCartStore.getState().addItem({ id: '1', name: 'A', price: 10, image_url: null });
    useCartStore.getState().removeItem('non-existent');

    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('handles updating quantity for a non-existent item', () => {
    useCartStore.getState().addItem({ id: '1', name: 'A', price: 10, image_url: null });
    useCartStore.getState().updateQuantity('non-existent', 5);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('returns 0 for totalItems when cart is empty', () => {
    expect(useCartStore.getState().totalItems()).toBe(0);
  });

  it('returns 0 for totalPrice when cart is empty', () => {
    expect(useCartStore.getState().totalPrice()).toBe(0);
  });

  it('handles adding same item 10 times', () => {
    const item = { id: '1', name: 'A', price: 5, image_url: null };
    for (let i = 0; i < 10; i++) {
      useCartStore.getState().addItem(item);
    }

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(10);
    expect(useCartStore.getState().totalPrice()).toBe(50);
  });

  it('handles items with decimal prices', () => {
    useCartStore.getState().addItem({ id: '1', name: 'A', price: 9.99, image_url: null });
    useCartStore.getState().addItem({ id: '2', name: 'B', price: 14.5, image_url: null });

    const total = useCartStore.getState().totalPrice();
    expect(total).toBeCloseTo(24.49);
  });
});
