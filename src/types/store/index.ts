export interface SidenavLinkData {
  title: string;
  path: string;
  id?: string;
  isBottomLink?: boolean;
}

export interface Post {
  post_id: string;
  caption: string;
  hashtags?: string
  image_url?: string;
}

export interface SavePostPayload {
  post: Post;
}

export interface DeleteSavedPostPayload {
  post_id: string;
}

export interface GeneratedPostsResponse {
  posts: Post[];
}

export interface GeneratePostPayload {
  text: string;
  posts_number: number;
  tone: string;
  hashtags_style: string;
  emojis: boolean;
  target_platform: string;
  post_length: string;
  suggestions: string;
}

export interface GeneratedImageResponse {
  image_url: string;
}

export interface AuthUser {
  id: string;
  //username: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  //username: string;
  email: string;
  password: string;
}

export interface ChangeUserEmail {
  new_email: string;
  password: string;
}

export interface ChangeUserPassword {
  current_password: string;
  new_password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface ModuleAPIConfig {
  url: string;
  method: "GET" | "POST";
  headers: Record<string, string>;
  enabled: boolean;
  refreshInterval?: number;

  // Field mapping: data.json.someField -> module.props.targetProp
  mapping: Record<string, string>;
}

export interface ApiModuleProps {
  //api: {
  id: string;
  name: string;
  url: string;
  method: "GET" | "POST";
  headers: Record<string, string>;
  enabled: boolean;
  refreshIntervalMs: number;
  responseSchema: any | null;
  transformPath: string;
  //};

  //status: {
  isFetching: boolean;
  lastFetchedAt: number | null;
  lastFetchError: string | null;
  //};

  lastData: any;
}

export type ModuleType =
  | {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    title: string;
    subtitle: string;
    type: string;
    props: ApiModuleProps | Record<string, any>; // API or normal
  };

