export type GenericObject<T = any> = { [key: string]: T };

export type Nullable<T> = T | null;

export type Undef<T> = T | undefined;

export type Maybe<T> = T | null | undefined;

export type StrNum = string | number;
