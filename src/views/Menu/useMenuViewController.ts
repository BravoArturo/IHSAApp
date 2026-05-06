import { MenuViewProps } from './types';
import useMenuViewModel from './useMenuViewModel';

const useMenuViewController = (): MenuViewProps => {
  const {} = useMenuViewModel();

  return {};
};

export default useMenuViewController;
