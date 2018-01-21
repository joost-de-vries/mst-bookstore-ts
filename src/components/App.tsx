import * as React from "react"
import { observer, inject } from "mobx-react"
import * as logo from "../logo.svg"
import "./App.css"

import Books from "./Books"
import BookDetails from "./BookDetails"
import Cart from "./Cart"
import DevTools from "./DevTools"
import { ViewStore } from "../stores/ViewStore";

function renderPage(viewStore: typeof ViewStore.Type) {
    switch (viewStore.page) {
        case "books":
            return <Books />
        case "book":
            const book = viewStore.selectedBook
            if (book) return <BookDetails book={book} />
            else return <h1>Book ${viewStore.selectedBookId} not found!</h1>
        case "cart":
            return <Cart />
        default:
            return "Sry, not found"
    }
}

const AppHeader = () => (
    <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to the React MobX Book shop!</h2>
    </div>
)
type HasChildren = { children: React.ReactNode}
const AppMenu = ({ children }: HasChildren) => <ul className="App-menu">{children}</ul>
type HasOnClick = {onClick: React.MouseEventHandler<HTMLAnchorElement>}
const AppMenuItem = ({ onClick, children }: HasChildren & HasOnClick) => (
    <li>
        <a onClick={onClick}>{children}</a>
    </li>
)

const App = inject("shop", "history")(
    observer(({ shop, history }) => (
        <div>
            <div className="App">
                <AppHeader />
                <AppMenu>
                    <AppMenuItem onClick={() => shop.view.openBooksPage()}>
                        Available books
                    </AppMenuItem>
                    <AppMenuItem onClick={() => shop.view.openCartPage()}>Your cart</AppMenuItem>
                </AppMenu>
                {shop.isLoading ? <h1>Loading...</h1> : renderPage(shop.view)}
            </div>
            <DevTools history={history}/>
        </div>
    ))
)

export default App
