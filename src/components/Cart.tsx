import * as React from "react"
import { observer, inject } from "mobx-react"
import "./Cart.css"
import { CartEntry as CE } from "../stores/CartStore"
import { ShopStore } from "../stores/ShopStore"
import { ChangeEvent } from "react";

const CartEntry = inject("shop")(
    observer(({ shop, entry }) => (
        <div className="Page-cart-item">
            <p>
                <a href={`/book/${entry.book.id}`} onClick={onEntryClick.bind(entry, shop)}>
                    {entry.book.name}
                </a>
            </p>
            {!entry.book.isAvailable && (
                <p>
                    <b>Not available anymore</b>
                </p>
            )}
            <div className="Page-cart-item-details">
                <p>
                    Amount:
                    <input
                        value={entry.quantity}
                        onChange={updateEntryQuantity.bind(null, entry)}
                    />
                    total: <b>{entry.price} €</b>
                </p>
            </div>
        </div>
    ))
)

function onEntryClick(this: typeof CE.Type, shop: typeof ShopStore.Type, e: MouseEvent) {
    shop.view.openBookPage(this.book)
    e.preventDefault()
    return false
}

function updateEntryQuantity(entry: typeof CE.Type, e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value) entry.setQuantity(parseInt(e.target.value, 10))
}

type InjectedShop = { shop: typeof ShopStore.Type}

const Cart = inject("shop")(
    observer(({ shop: { cart } }) => (
        <section className="Page-cart">
            <h2>Your cart</h2>
            <section className="Page-cart-items">
                {cart.entries.map((entry: typeof CE.Type) => <CartEntry key={entry.book.id} entry={entry} />)}
            </section>
            <p>Subtotal: {cart.subTotal} €</p>
            {cart.hasDiscount && (
                <p>
                    <i>Large order discount: {cart.discount} €</i>
                </p>
            )}
            <p>
                <b>Total: {cart.total} €</b>
            </p>
            <button disabled={!cart.canCheckout} onClick={() => cart.checkout()}>
                Submit order
            </button>
        </section>
    ))
)

export default Cart
