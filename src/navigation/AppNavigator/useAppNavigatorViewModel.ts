import { AppNavigatorViewModelType } from './types';
import { useIsOnline } from '../../models/app/state/hook/useIsOnline';

function useAppNavigatorViewModel(): AppNavigatorViewModelType {
  const { isOnline } = useIsOnline();
  return { isOnline };
}

export default useAppNavigatorViewModel;
