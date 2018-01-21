import { types, getParent, flow } from "mobx-state-tree"

export const Book = types.model("Book", {
    id: types.identifier(types.string),
    name: types.string,
    author: types.string,
    price: types.number,
    isAvailable: true
})

export const BookStore = types
    .model("BookStore", {
        isLoading: true,
        books: types.map(Book)
    })
    .views(self => ({
        get shop() {
            return getParent(self)
        },
        get sortedAvailableBooks() {
            return sortBooks(self.books.values())
        }
    }))
    .actions(self => {
        function markLoading(loading: boolean) {
            self.isLoading = loading
        }

        function updateBooks(json: any) {
            self.books.values().forEach(book => (book.isAvailable = false))
            json.forEach((bookJson: any) => {
                self.books.put(bookJson)
                self.books.get(bookJson.id)!.isAvailable = true
            })
        }

        const loadBooks = flow(function* loadBooksGenerator() {
            try {
                const json = yield self.shop.fetch("/books.json")
                updateBooks(json)
                markLoading(false)
            } catch (err) {
                console.error("Failed to load books ", err)
            }
        })

        return {
            updateBooks,
            loadBooks
        }
    })

function sortBooks(books: typeof Book.Type[]) {
    return books
        .filter(b => b.isAvailable)
        .sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? 0 : -1))
}
