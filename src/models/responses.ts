interface Link {
  rel: string;
  href?: string;
}

export interface RegisterResource {
  message: string;
  links: Link[];
}

export interface LoginResource {
  access_token: string;
  refresh_token: string;
  links: Link[];
}

export interface LogoutResource {
  message: string;
  links: Link[];
}

export interface RefreshResource {
  access_token: string;
  links: Link[];
}

export interface UserResource {
  id: string;
  name: string;
  email: string;
  birth_date: string;
  role: number;
  links: Link[];
}

export interface ErrorResource {
  message: string;
  links: Link[];
}
