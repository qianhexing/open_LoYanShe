/**
 * Outlink 原生桥接（鸿蒙 ArkWebView / iOS LoYanSheNative）
 * 约定文档：doc/outlink-native-bridge.md
 */

function parsePayload(raw) {
  if (raw == null) return null
  if (typeof raw === 'object') return raw
  if (typeof raw !== 'string') return null
  if (raw === 'webPageReady') return { type: 'webPageReady' }
  try {
    return JSON.parse(raw)
  } catch (e) {
    return { type: 'raw', data: raw }
  }
}

function getIOSHandler() {
  try {
    return window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.LoYanSheNative
  } catch (e) {
    return null
  }
}

const listeners = []
let h5Port = null

function emit(msg) {
  listeners.forEach((fn) => {
    try { fn(msg) } catch (e) {}
  })
}

function ensureReceiveHooks() {
  if (typeof window === 'undefined') return

  window.LoYanSheNative = window.LoYanSheNative || {}
  window.LoYanSheNative.onNativeMessage = function (raw) {
    emit(parsePayload(raw))
  }

  // 鸿蒙 MessagePort：监听 __init_port__
  window.addEventListener('message', (event) => {
    const ports = event.ports
    if (ports && ports[0]) {
      h5Port = ports[0]
      h5Port.onmessage = (e) => {
        emit(parsePayload(e.data))
      }
    }
  })
}

ensureReceiveHooks()

function postToNative(payload) {
  const asString = typeof payload === 'string' ? payload : JSON.stringify(payload)

  if (h5Port) {
    h5Port.postMessage(asString)
    return true
  }

  if (window.ArkWebView && typeof window.ArkWebView.postMessage === 'function') {
    // 鸿蒙 JSProxy：webPageReady 用纯字符串；其它用 JSON
    if (payload && payload.type === 'webPageReady') {
      window.ArkWebView.postMessage('webPageReady')
    } else {
      window.ArkWebView.postMessage(asString)
    }
    return true
  }

  const ios = getIOSHandler()
  if (ios) {
    ios.postMessage(asString)
    return true
  }

  return false
}

export const nativeBridge = {
  isNative() {
    return !!(getIOSHandler() || (window.ArkWebView && window.ArkWebView.postMessage) || h5Port)
  },

  ready() {
    return postToNative({ type: 'webPageReady' })
  },

  jump(path, params = {}) {
    return postToNative({ type: 'jump', path, params })
  },

  back(params) {
    return postToNative({ type: 'back', params: params || {} })
  },

  backAndReload() {
    return postToNative({ type: 'BackAndReload' })
  },

  onMessage(fn) {
    if (typeof fn === 'function') listeners.push(fn)
    return () => {
      const i = listeners.indexOf(fn)
      if (i >= 0) listeners.splice(i, 1)
    }
  }
}

export default nativeBridge
