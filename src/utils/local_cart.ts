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
    
    clearCart: () => {
        localStorage.removeItem('cart');
    },
}

