import { when, reaction } from "mobx"
import { types, getParent, getSnapshot, applySnapshot } from "mobx-state-tree"
import { Book } from "./BookStore"

export const CartEntry = types
    .model("CartEntry", {
        quantity: 0,
        book: types.reference(Book)
    })
    .views(self => ({
        get price() {
            return self.book.price * self.quantity
        },
        get isValidBook() {
            return self.book.isAvailable
        }
    }))
    .actions(self => ({
        increaseQuantity(amount: number) {
            self.quantity += amount
        },
        setQuantity(amount: number) {
            self.quantity = amount
        }
    }))

export const CartStore = types
    .model("CartStore", {
        entries: types.array(CartEntry)
    })
    .views(self => ({
        get subTotal() {
            return self.entries.reduce((sum, e) => sum + e.price, 0)
        }
    }))
    .views(self => ({
        get shop() {
            return getParent(self)
        },
        get hasDiscount() {
            return self.subTotal >= 100
        },
        get discount() {
            return self.subTotal * ((self as any).hasDiscount ? 0.1 : 0)
        },
        get total(): number {
            return self.subTotal - (self as any).discount
        },
        get canCheckout() {
            return (
                self.entries.length > 0 &&
                self.entries.every(entry => entry.quantity > 0 && entry.isValidBook)
            )
        }
    }))
    .actions(self => ({
        clear() {
            self.entries.clear()
        },
        readFromLocalStorage() {
            const cartData = window.localStorage.getItem("cart")
            if (cartData) applySnapshot(self, JSON.parse(cartData))
        }
    }))
    .actions(self => ({
        afterAttach() {
            if (typeof window !== "undefined" && window.localStorage) {
                when(
                    () => !self.shop.isLoading,
                    () => {
                        self.readFromLocalStorage()
                        reaction(
                            () => getSnapshot(self),
                            json => {
                                window.localStorage.setItem("cart", JSON.stringify(json))
                            }
                        )
                    }
                )
            }
        },
        addBook(book: typeof Book.Type, quantity: number = 1, notify: boolean = true) {
            let entry = self.entries.find(ent => ent.book === book)
            if (!entry) {
                const newEntry = CartEntry.create({ book: book, quantity: 0 })
                self.entries.push(newEntry)
                entry = self.entries[self.entries.length - 1]
            }
            entry.increaseQuantity(quantity)
            if (notify) self.shop.alert("Added to cart")
        },
        checkout() {
            const total = self.total;
            self.clear()
            self.shop.alert(`Bought books for ${total} € !`)
        },
        readFromLocalStorage() {
            const cartData = window.localStorage.getItem("cart")
            if (cartData) applySnapshot(self, JSON.parse(cartData))
        }
    }))
