export interface User {
  id: string;
  username: string;
  email: string;
}

export interface ResolvedUser extends User {
  profilePictureUrl: string;
  topStarredRepositories: string[];
}
