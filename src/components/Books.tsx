import * as React from "react"
import { observer, inject } from "mobx-react"
import { Book } from "../stores/BookStore"

const BookEntry = inject("shop")(
    observer(({ book, shop }) => (
        <li>
            <a
                href={`/book/${book.id}`}
                onClick={e => {
                    e.preventDefault()
                    shop.view.openBookPage(book)
                    return false
                }}
            >
                {book.name}
            </a>
        </li>
    ))
)

const Books = inject("shop")(
    observer(({ shop }) => (
        <section className="Page-books">
            <h1>Available books</h1>
            <ol>
                {shop.sortedAvailableBooks.map((book: typeof Book.Type) => <BookEntry key={book.id} book={book} />)}
            </ol>
        </section>
    ))
)

export default Books
