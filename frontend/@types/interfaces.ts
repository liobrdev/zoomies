// Misc
export interface IBreadcrumbListItem {
  '@type': string;
  position: number;
  name: string;
  item: string;
}

export interface IBreed {
  breed_name: string;
  thumbnail_url: string;
}

export interface IErrorMsg {
  id: string;
  msg: string;
}

export interface IErrorInfo {
  [key: string]: IErrorMsg[];
}

// Reducer states
export interface IMasterState {
  breeds: IBreed[];
  limit: number;
  offset: number;
  isRetrieving: boolean;
  hasMore: boolean;
  errorRetrieve: IErrorInfo;
  searchBarOn: boolean;
  searchBreed: string;
}
