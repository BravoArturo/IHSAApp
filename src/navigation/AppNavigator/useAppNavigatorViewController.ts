import React, { useEffect, useRef } from 'react';
import { AppNavigatorViewProps } from './types';
import { Alert, AppState, Platform, AppStateStatus } from 'react-native';
import useAppNavigatorViewModel from './useAppNavigatorViewModel';

function useAppNavigatorViewController(): AppNavigatorViewProps {
  const {} = useAppNavigatorViewModel();
}

export default useAppNavigatorViewController;
