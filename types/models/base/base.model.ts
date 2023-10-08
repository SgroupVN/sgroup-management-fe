export class BaseModel<T> {
  data: T;
  meta: any;
  success: boolean;

  public constructor(init?: Partial<BaseModel<T>>) {
    Object.assign(this, init);
  }
}
