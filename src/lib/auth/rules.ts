export const firebaseRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    function belongsToOrganization(orgId) {
      return isAuthenticated() && getUserData().organizationId == orgId;
    }

    match /organizations/{organizationId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }

    match /stands/{standId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }

    match /posters/{posterId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }

    match /publications/{publicationId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }

    match /maintenance/{maintenanceId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }

    match /banners/{bannerId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
        (resource == null || belongsToOrganization(resource.data.organizationId));
    }
  }
}
`;