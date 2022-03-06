export const SessionSubscription = `subscription SessionSubscription {
  onUpdateSession {
    active
    added
    email
    id
    latitude
    longitude
    location
    modified
    phone
    username
    userAccess
  }
}`;
