import { createSelector, MemoizedSelector } from '@ngrx/store';
import { ReturnRequest, ReturnRequestList } from '../../../model/order.model';
import {
  OrderReturnRequestState,
  StateWithUser,
  UserState,
} from '../user-state';
import { getUserState } from './feature.selector';
import { LoaderState } from '../../../state/utils/loader/loader-state';
import { StateLoaderSelectors } from '../../../state/utils/index';

export const getOrderReturnRequestState: MemoizedSelector<
  StateWithUser,
  OrderReturnRequestState
> = createSelector(
  getUserState,
  (state: UserState) => state.orderReturn
);

export const getOrderReturnRequest: MemoizedSelector<
  StateWithUser,
  ReturnRequest
> = createSelector(
  getOrderReturnRequestState,
  (state: OrderReturnRequestState) => state.returnRequest
);

export const getOrderReturnRequestListState: MemoizedSelector<
  StateWithUser,
  LoaderState<ReturnRequestList>
> = createSelector(
  getUserState,
  (state: UserState) => state.orderReturnList
);

export const getOrderReturnRequestList: MemoizedSelector<
  StateWithUser,
  ReturnRequestList
> = createSelector(
  getOrderReturnRequestListState,
  (state: LoaderState<ReturnRequestList>) =>
    StateLoaderSelectors.loaderValueSelector(state)
);