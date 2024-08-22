export interface GithubUser extends Express.User {
  displayName?: string;
  profileUrl?: string;
  photos: { value: string }[];
}
