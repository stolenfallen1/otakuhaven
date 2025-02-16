export const CART_UPDATED = 'CART_UPDATED';

export function emitCartUpdate() {
    window.dispatchEvent(new Event(CART_UPDATED));
}