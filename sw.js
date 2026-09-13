/* LogTime Service Worker
 *
 * 只负责一件事：到点通知的展示与点击回焦。
 *
 * 刻意不做任何资源缓存 —— 应用本身就是单文件，加了 SW 缓存只会带来
 * "明明更新了却还看到旧版"的问题，这对一个还在频繁迭代的产品是负收益。
 * 这里只借 SW 的能力：移动端浏览器不允许用 new Notification()，
 * 必须通过 ServiceWorkerRegistration.showNotification()。
 */

self.addEventListener('install', function () {
    self.skipWaiting();
});

self.addEventListener('activate', function (e) {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', function (e) {
    e.notification.close();
    e.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
            // 已经开着就聚焦，没开就打开
            for (var i = 0; i < list.length; i++) {
                if (list[i].url && 'focus' in list[i]) return list[i].focus();
            }
            if (self.clients.openWindow) return self.clients.openWindow('./');
        })
    );
});
