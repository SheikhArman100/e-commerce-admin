// Fix: Define and export all necessary types for the application.
export enum QuestionType {
  TEXT = 'TEXT',
  DROPDOWN = 'DROPDOWN',
  DATE = 'DATE',
  SIGN = 'SIGN',
}

export interface ImageAsset {
  id: string;
  name: string;
  url: string;
}

// Define specific question types for a discriminated union
export interface TextQuestion {
  id:string;
  text: string;
  type: QuestionType.TEXT;
  placeholder?: string;
}

export interface DropdownQuestion {
  id: string;
  text: string;
  type: QuestionType.DROPDOWN;
  options: string[];
}

export interface DateQuestion {
  id: string;
  text: string;
  type: QuestionType.DATE;
  placeholder?: string;
}

export interface SignQuestion {
  id: string;
  text: string;
  type: QuestionType.SIGN;
  placeholder?: string;
}

// Union type for any question
export type Question = TextQuestion | DropdownQuestion | DateQuestion | SignQuestion;

export interface TextSnippet {
  id: string;
  name: string;
  text: string;
}

export interface ButtonContent {
  id: string;
  text: string;
  isDefault?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export interface ContentContainerStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
}

export interface ContentItem {
  type: 'QUESTION' | 'TEXT_SNIPPET' | 'BUTTON';
  id: string;
  width?: number;
  height?: number;
}

export interface StepLogic {
  questionId: string;
  optionValue: string;
  nextStepId: string;
}

export interface Step {
  id: string;
  name: string;
  backgroundAssetId: string | null;
  contentContainerStyle: ContentContainerStyle;
  contentItems: ContentItem[];
  logic: StepLogic[];
}

export interface Campaign {
  id: string;
  name: string;
  userId: string;
  steps: Step[];
  lastModified: string;
  status: 'active' | 'inactive';
  // Global assets for the campaign
  imageAssets?: ImageAsset[];
  questions?: Question[];
  textSnippets?: TextSnippet[];
  buttons?: ButtonContent[];
}
