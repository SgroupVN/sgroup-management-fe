export class BaseModel<T> {
  data: T;
  success: boolean;

  public constructor(init?: Partial<BaseModel<T>>) {
    Object.assign(this, init);
  }
}
