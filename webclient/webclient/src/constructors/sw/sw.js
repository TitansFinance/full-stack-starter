/* eslint-env browser, serviceworker, es6 */
import * as log from 'loglevel'

log.info(`[Service Worker] bootstrap: (${Date.now()}`)

self.addEventListener('push', function(event) {
  log.info('[Service Worker] Push Received.')
  const json = event.data.json()
  const { body, icon, badge, title } = json
  log.info(`[Service Worker] Push had this data: `, json)

  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon,
    badge,
  }))
})