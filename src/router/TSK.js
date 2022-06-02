
let app;

class HistoryRoute {
  constructor() {
    this.current = null
  }
}


class MyRouter {
  // 定义 router-view 和 router-link 
  constructor(options) {
    this.mode = options.mode || "hash"
    //需要对 routes 进行处理，处理成比较好 { path:component}
    this.routes = options.routes || [];
    this.routesMap = this.createMap(this.routes)
    this.history = new HistoryRoute();
    this.init()
  }


  createMap(routes) {
    return routes.reduce((prev, cur) => {
      prev[cur.path] = cur.component;
      return prev
    }, {})
  }
  init() {
    if (this.mode == "hash") {
      location.hash ? '' : location.hash = "/";
      window.addEventListener("load", () => {
        this.history.current = window.location.hash.slice(1)

      })
      window.addEventListener("hashchange", () => {
        this.history.current = window.location.hash.slice(1)
      })
    } else if (this.mode == "history") {
      location.pathname ? '' : location.pathname = "/";
      window.addEventListener("load", () => {
        this.history.current = window.location.pathname

      })
      window.addEventListener("popstate", () => {
        this.history.current = window.location.pathname
      })
    }
  }


}
//  只有 new vue 里面有 一个 router ，但是其他组件都可以使用
// router 是全局路由器 ，route 是当前页面路由
MyRouter.install = function (vue) {
  vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.router) {
        // this._root.router = this.$options.router
        this._root = this;
        this._router = this.$options.router;
        vue.util.defineReactive(this, "xxx", this._router.history)
      } else {
        this._root = this.$parent && this.$parent._root
      }

      Object.defineProperty(this, "$router", {
        get() {
          return this._root.router
        }
      })

      Object.defineProperty(this, "$route", {
        get() {
          return this._root._router.history.current
        }
      })

    },
  })


  vue.component("router-view", {
    render(h) {
      let current = this._root._router.history.current
      let routeMap = this._root._router.routesMap;
      return h(routeMap[current])
    },
  });



  vue.component('router-link', {
    props: {
      to: String
    },
    render(h) {
      let mode = this._root._router.mode;
      let to = mode === "hash" ? "#" + this.to : this.to
      return h('a', { attrs: { href: to } }, this.$slots.default)
    }
  })
}




export default MyRouter