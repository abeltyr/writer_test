export type Editor = {
  id: string;
  editorVersion: string;
  editorState: EditorState;
  source: string;
  version: string;
  lastSaved: string;
};

export type EditorState = {
  root: EditorStateChildren[];
  rule: EditorStateRule;
};

export type EditorStateChildren = {
  id: string;
  format?: TextAlignment;
  mode?: string;
  className: string | "";
  children?: EditorStateChildren[];
  content?: string;
  type: EditorType;
  indent: number | 0;
  direction: string;
  disabled?: boolean;
  ref?: any;
  additional?: {
    link?: EditorLinkAttrs;
    assets?: EditorAssetsAttrs;
    ytVideo?: EditorYoutubeVideoAttrs;
  };
};

export type EditorStateRule = {
  maxChildrenAmount: number | null;
  availableFeature: string[];
};

export type EditorLinkAttrs = {
  href: string;
  ref?: string;
  title?: string;
  target?: string;
  extra?: string[];
};

export type EditorAssetsAttrs = {
  source: string;
  sourceType: string;
  alt: string;
  caption: string;
  showCaption: boolean;
  constrain: AssetsConstrain;
  assetFormat: string;
  extra: string[];
};

export type EditorYoutubeVideoAttrs = {
  videoId: string;
  extra: string[];
};

export type EditorType =
  | "P"
  | "H1"
  | "H2"
  | "H3"
  | "InlineLink"
  | "Link"
  | "Quote"
  | "Bullet"
  | "ListItem"
  | "Code"
  | "Image"
  | "Video"
  | "Audio"
  | "YTVideo";

export type TextAlignment = "Start" | "Center" | "End" | "Justify" | null;

export type AssetsConstrain = {
  width: string | number;
  height: string | number;
  maxHeight?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  minWidth?: string | number;
};
