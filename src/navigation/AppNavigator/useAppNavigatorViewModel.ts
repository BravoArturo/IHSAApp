import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { AppNavigatorViewModelType } from './types';
import { useIsOnline } from '../../models/app/state/hook/useIsOnline';
import { useAppStateStore } from '../../models/app/state/store/appStateStore';

function useAppNavigatorViewModel(): AppNavigatorViewModelType {
  const { isOnline } = useIsOnline();
  const changeIsOnForeground = useAppStateStore(
    state => state.changeIsOnForeground,
  );

  const handleChangeIsOnForeground = (value: boolean) => {
    changeIsOnForeground(value);
  };

  useEffect(() => {
    handleChangeIsOnForeground(AppState.currentState === 'active');
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        handleChangeIsOnForeground(state === 'active');
      },
    );
    return () => subscription.remove();
  }, []);

  return { isOnline };
}

export default useAppNavigatorViewModel;
