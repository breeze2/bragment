export type IParam<T> = T extends (param: infer P) => any ? P : T;
export type IReturn<T> = T extends (...args: any[]) => infer P ? P : any;
export type IPartial<T> = { [P in keyof T]?: T[P] };
