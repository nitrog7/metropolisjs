export const MessageUpdate = `mutate MessageUpdate($message: MessageInput) {
  onUpdateMessage(message: $message) {
    added
    content
    from
    modified
    to
  }
}`;

export const MessageSubscription = `subscription MessageSubscription {
  onUpdateMessage(message: $message) {
    added
    content
    from
    modified
    to
  }
}`;
