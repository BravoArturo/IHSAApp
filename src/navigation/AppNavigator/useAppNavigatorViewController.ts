import { AppNavigatorViewProps } from './types';
import useAppNavigatorViewModel from './useAppNavigatorViewModel';

function useAppNavigatorViewController(): AppNavigatorViewProps {
  const { isOnline } = useAppNavigatorViewModel();
  return { isOnline };
}

export default useAppNavigatorViewController;
