import { types, getParent } from "mobx-state-tree"
import { Book } from "../stores/BookStore"

export const ViewStore = types
    .model({
        page: "books",
        selectedBookId: ""
    })
    .views(self => ({
        get shop() {
            return getParent(self)
        },
        get isLoading() {
            return getParent(self).isLoading
        }
    }))
    .views(self => ({
        get currentUrl() {
            switch (self.page) {
                case "books":
                    return "/"
                case "book":
                    return "/book/" + self.selectedBookId
                case "cart":
                    return "/cart"
                default:
                    return "/404"
            }
        },
        get selectedBook() {
            return self.isLoading || !self.selectedBookId
                ? null
                : self.shop.books.get(self.selectedBookId)
        }
    }))
    .actions(self => ({
        openBooksPage() {
            self.page = "books"
            self.selectedBookId = ""
        },
        openBookPage(book: typeof Book.Type) {
            self.page = "book"
            self.selectedBookId = book.id as string// fix this
        },
        openBookPageById(id: typeof Book.Type.id) {
            self.page = "book"
            self.selectedBookId = id as string // fix this
        },
        openCartPage() {
            self.page = "cart"
            self.selectedBookId = ""
        }
    }))
