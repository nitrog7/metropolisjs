export const NotificationUpdate = `mutate NotificationUpdate($notification: NotificationInput) {
  onUpdateNotification(notification: $notification) {
    added
    content
    from
    modified
    to
  }
}`;

export const NotificationSubscription = `subscription NotificationSubscription {
  onUpdateNotification(notification: $notification) {
    added
    content
    from
    modified
    to
  }
}`;
