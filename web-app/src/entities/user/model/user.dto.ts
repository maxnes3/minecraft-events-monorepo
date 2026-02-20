export interface UserPlatformDTO {
  name: string;
  login: string;
  profileImgUrl?: string | undefined;
}

export interface UserDTO {
  platforms: UserPlatformDTO[];
  lang: string;
  createdAt: string;
}
