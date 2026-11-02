# Outlink 原生桥接约定（H5 ↔ App）

供网页端（`open_LoYanShe` / lolitalibrary.com H5）与原生客户端（鸿蒙 Outlink、iOS Outlink）对齐。  
入口页由 App 容器加载，URL 会附带登录态 query：`token=<jwt>`（已有 `?` 则用 `&`）。

## 1. 探测环境

| 平台 | 判定 |
|------|------|
| 鸿蒙 | `typeof window.ArkWebView?.postMessage === 'function'`，或收到 `__init_port__` 的 MessagePort |
| iOS | `window.webkit?.messageHandlers?.LoYanSheNative` |
| 普通浏览器 | 以上都不存在 → 走站内路由，勿调用原生 |

建议统一封装（见 `utils/nativeBridge.js`）。

## 2. H5 → Native

消息体均为 **JSON 字符串**（鸿蒙 MessagePort / iOS `postMessage` 一致）。

### 2.1 `webPageReady`（可选握手）

鸿蒙注入的 `window.ArkWebView.postMessage('webPageReady')`（字符串，非 JSON）。  
iOS：`LoYanSheNative.postMessage(JSON.stringify({ type: 'webPageReady' }))`。

### 2.2 `jump` — 打开原生页

```json
{
  "type": "jump",
  "path": "CommunityDetail",
  "params": { "id": 123, "comment": true }
}
```

- `path`：原生路由名（与鸿蒙 `pushPathByName` 一致，如 `CommunityDetail` / `LibraryDetail` / `Compilations`）。
- `params`：路由参数对象。
- 原生从该页 `pop` 且带回 `{ "reload": true }` 时，会向 H5 发 `reload`（见下）。

### 2.3 `back` — 关闭 Outlink / 返回

```json
{
  "type": "back",
  "params": { "reload": true, "community_id": 123 }
}
```

`params` 可空；`reload: true` 表示外层列表应刷新。

### 2.4 `BackAndReload` — 返回并强制刷新

```json
{ "type": "BackAndReload" }
```

等价于 `back` + `{ "reload": true }`。

## 3. Native → H5

### 3.1 鸿蒙

1. `controller.postMessage('__init_port__', [h5Port], '*')`  
2. H5 在 `message` 事件中拿到 MessagePort，之后双向 `port.postMessage(jsonString)`。  
3. 初始化后原生会发：

```json
{ "type": "setTheme", "data": 0 }
```

`data`：系统主题（`0` 浅色 / `1` 深色，与鸿蒙 ColorMode 一致）。

4. 从 `jump` 返回且需刷新时：

```json
{ "type": "reload" }
```

H5 应重新拉数 / `location.reload()`（按业务选择）。

### 3.2 iOS

- H5 → App：`window.webkit.messageHandlers.LoYanSheNative.postMessage(<string|object>)`  
  （若传 object，WK 会序列化；**推荐统一传 JSON 字符串**，与鸿蒙一致。）
- App → H5：注入并调用

```js
window.LoYanSheNative = window.LoYanSheNative || {}
window.LoYanSheNative.onNativeMessage = function (jsonString) { /* 解析 type */ }
// 兼容鸿蒙命名
window.ArkWebView = window.ArkWebView || {
  postMessage: function (msg) {
    window.webkit.messageHandlers.LoYanSheNative.postMessage(
      typeof msg === 'string' ? msg : JSON.stringify(msg)
    )
  }
}
```

iOS 进入页后同样会派发 `{ type: 'setTheme', data: 0|1 }`；`jump` 返回刷新时派发 `{ type: 'reload' }`。

## 4. H5 推荐调用示例

```js
import { nativeBridge } from '@/utils/nativeBridge'

// 页面就绪
nativeBridge.ready()

// 跳转原生详情
nativeBridge.jump('CommunityDetail', { id: 9269 })

// 仅关闭
nativeBridge.back()

// 关闭并让 App 列表刷新
nativeBridge.backAndReload()

// 监听原生
nativeBridge.onMessage((msg) => {
  if (msg.type === 'setTheme') {
    // msg.data === 0 | 1
  }
  if (msg.type === 'reload') {
    // 刷新当前 H5 数据
  }
})
```

## 5. 安全与域名

App 打开外链前校验 URL 包含可信域名 `lolitalibrary.com`（鸿蒙 / iOS 一致）。  
H5 勿依赖非可信来源的 `postMessage`；仅处理己方桥接通道。

## 6. 变更记录

| 日期 | 说明 |
|------|------|
| 2026-11-03 | 初版：对齐鸿蒙 Outlink.ets，补齐 iOS `LoYanSheNative` 与网页工具封装 |
