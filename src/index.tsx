import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "mobx-react"
import { observable, reaction, IObservableArray } from "mobx"
import {
    onSnapshot,
    onAction,
    onPatch,
    applySnapshot,
    applyAction,
    applyPatch,
    getSnapshot
} from "mobx-state-tree"

import createRouter from "./utils/router"
import App from "./components/App"
import "./index.css"

import { ShopStore } from "./stores/ShopStore"

const fetcher = (url: RequestInfo) => window.fetch(url).then(response => response.json())
const shop = ShopStore.create(
    {},
    {
        fetch: fetcher,
        alert: (m: any) => console.log(m) // Noop for demo: window.alert(m)
    }
)
export type AppHistory = {
    snapshots: IObservableArray<{}>
    actions: IObservableArray<{}>
    patches: IObservableArray<{}>
}
const history: AppHistory = {
    snapshots: observable.shallowArray(),
    actions: observable.shallowArray(),
    patches: observable.shallowArray()
}

/**
 * Rendering
 */
ReactDOM.render(
    <Provider shop={shop} history={history}>
        <App />
    </Provider>,
    document.getElementById("root")
)

/**
 * Routing
 */

reaction(
    () => shop.view.currentUrl,
    path => {
        if (window.location.pathname !== path) window.history.pushState(null, null!, path)
    }
)

const router: (path: string) => boolean = createRouter({
    "/book/:bookId": ({ bookId }) => shop.view.openBookPageById(bookId),
    "/cart": shop.view.openCartPage,
    "/": shop.view.openBooksPage
})

window.onpopstate = function historyChange(ev: PopStateEvent) {
    if (ev.type === "popstate") router(window.location.pathname)
}

router("window.location.pathname");

// ---------------

(window as any).shop = shop // for playing around with the console

/**
 * Poor man's effort of "DevTools" to demonstrate the api:
 */

let recording = true // supress recording history when replaying

onSnapshot(
    shop,
    s =>
        recording &&
        history.snapshots.unshift({
            data: s,
            replay() {
                recording = false
                applySnapshot(shop, s)
                recording = true
            }
        })
)
onPatch(
    shop,
    s =>
        recording &&
        history.patches.unshift({
            data: s,
            replay() {
                recording = false
                applyPatch(shop, s)
                recording = true
            }
        })
)
onAction(
    shop,
    s =>
        recording &&
        history.actions.unshift({
            data: s,
            replay() {
                recording = false
                applyAction(shop, s)
                recording = true
            }
        })
)

// add initial snapshot
const initial = getSnapshot(shop)
history.snapshots.push({
    data: initial,
    replay() {
        // TODO: DRY
        recording = false
        applySnapshot(shop, initial)
        recording = true
    }
})
