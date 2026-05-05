export type RoutesType<T> = {
  name: keyof T;
  component: React.FC;
}[];
