export type LoginStatus = 0 | 1;
export interface Session {
  username: string;
  sessionDir: string;
  login_status: LoginStatus;
}

export interface Comment {
  username: string;
  video_url: string;
  comment_status: LoginStatus;
  comment: string;
}

export interface searchParam {
  keyword: string;
}

export interface SearchPreferences {
  searchType: 'keyword' | 'trending';
  keyword?: string;
  sortBy?: 'date' | 'viewCount' | 'relevance';
  commentType: 'ai' | 'copy' | 'manual';
  manualCommentType?: 'csv' | 'direct';
  comment?: string;
}