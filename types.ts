export interface Option {
  name: string;
  selected: boolean;
}

export interface Subcategory {
  name: string;
  options: Option[];
}

export interface Category {
  name: string;
  subcategories: Subcategory[];
}

export type Categories = Category[];

