interface CartItem {
    productId: string;
    quantity: number;
}

export const localCart = {
    getItems: (): CartItem[] => {
        if (typeof window === 'undefined') return [];
        const items = localStorage.getItem('cart');
        return items ? JSON.parse(items) : [];
    },

    addItem: (productId: string, quantity: number = 1) => {
        const items = localCart.getItems();
        const existingItem = items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            items.push({ productId, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(items));
    },

    updateQuantity: (productId: string, quantity: number) => {
        const items = localCart.getItems();
        const existingItem = items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(items));
        }
    },

    removeItem: (productId: string) => {
        const items = localCart.getItems();
        const filteredItems = items.filter(item => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(filteredItems));
    },

    clearCart: () => {
        localStorage.removeItem('cart');
    },
}

