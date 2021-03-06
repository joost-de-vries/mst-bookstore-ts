import * as React from "react"
import * as ReactDOM from "react-dom"
import App from "./App"
import { Provider } from "mobx-react"
import * as renderer from "react-test-renderer"
import * as fs from "fs"

import { ShopStore } from "../stores/ShopStore"

const bookFetcher = () => Promise.resolve(JSON.parse(
    fs.readFileSync("./public/books.json", { encoding: "utf-8" })
))

it("matches snapshot before and after loading", done => {
    const shop = ShopStore.create({}, { fetch: bookFetcher })

    const app = renderer.create(
        <Provider shop={shop} history={null}>
            <App />
        </Provider>
    )
    let tree = app.toJSON()
    expect(tree).toMatchSnapshot()

    setTimeout(() => {
        let atree = app.toJSON()
        expect(atree).toMatchSnapshot()
        done()
    }, 100)
})
