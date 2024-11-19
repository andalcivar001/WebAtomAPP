export interface Login {
  token: string;
  user: User;
}

interface UserMetadata {
  creationTime: string;
  lastRefreshTime: string | null;
  lastSignInTime: string | null;
  tokensValidAfterTime: string;
}

export interface User {
  disabled: boolean;
  email: string;
  emailVerified: boolean;
  metadata: UserMetadata;
  providerData: any[]; // Aquí puedes especificar el tipo de datos si tienes más información sobre la estructura de los proveedores.
  uid: string;
}
