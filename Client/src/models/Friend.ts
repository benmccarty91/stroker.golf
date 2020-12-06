export interface Friend {
  Name: string;
  Email: string;
  PhotoUrl: string;
  UserId: string;
  FriendId: string;
  ApprovalAuthority: string;
  FriendStatus: FriendStatus;
}

export enum FriendStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
}
