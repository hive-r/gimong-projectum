export type ID = string;
export type ISODateString = string;

export interface BaseMeta {
  dateCreated: ISODateString;
  dateUpdated?: ISODateString;
  isArchived: boolean;
  dateArchived?: ISODateString;
}

export interface AssetRecord extends BaseMeta {
  id: ID;
  url: string;   
  title: string;
  description?: string;
}

export interface InventoryRecord extends BaseMeta {
  id: ID;
  title: string;
  assetIds: ID[]; 
}
