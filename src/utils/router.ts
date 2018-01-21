import route from "path-match"

type CallbackFunctionVariadic = (...args: any[]) => void
type Routes = { [index: string]: CallbackFunctionVariadic }
export default function createRouter(routes: Routes): (path: string) => boolean {
    const matchers = Object.keys(routes).map(path => [route()(path), routes[path]])
    return function(path: string) {
        return matchers.some(([matcher, f]) => {
            const result = matcher(path)
            if (result === false) return false
            f(result)
            return true
        })
    }
}
