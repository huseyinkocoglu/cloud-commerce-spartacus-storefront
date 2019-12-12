import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { AuthService } from '../../auth/index';
import * as fromReducers from '../../cart/store/reducers/index';
import {
  OCC_USER_ID_ANONYMOUS,
  OCC_USER_ID_CURRENT,
} from '../../occ/utils/occ-constants';
import { StateWithProcess } from '../../process';
import * as fromProcessReducers from '../../process/store/reducers/index';
import { StateWithMultiCart } from '../store';
import { SelectiveCartService } from './selective-cart.service';
import { MultiCartService } from './multi-cart.service';
import { User, OrderEntry } from '../../model';
import { UserService } from '../../user';

const TEST_USER_ID = 'test@test.com';
const TEST_CUSTOMER_ID = '-test-customer-id';
const TEST_CART_ID = 'test-cart-id';
const TEST_PRODUCT_CODE = 'test-product-code';

const testUser: User = {
  uid: TEST_USER_ID,
  customerId: TEST_CUSTOMER_ID,
};

const mockCartEntry: OrderEntry = {
  entryNumber: 0,
  product: { code: TEST_PRODUCT_CODE },
  quantity: 1,
};

class AuthServiceStub {
  getOccUserId(): Observable<string> {
    return new BehaviorSubject<string>(OCC_USER_ID_CURRENT).asObservable();
  }
}

class MultiCartServiceStub {
  loadCart() {}
  deleteCart() {}
  initAddEntryProcess() {}
  getCartEntity() {
    return of({});
  }
  assignEmail() {}
  getEntry() {
    return of({});
  }
  updateEntry() {}
  removeEntry() {}
  getEntries() {}
  createCart() {}
  addEntry() {}
  isStable() {}
}

class UserServiceStup {
  get(): Observable<User> {
    return of(testUser);
  }
}

describe('Selective Cart Service', () => {
  let service: SelectiveCartService;
  let multiCartService: MultiCartService;
  let store: Store<StateWithMultiCart | StateWithProcess<void>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          'multi-cart',
          fromReducers.getMultiCartReducers()
        ),
        StoreModule.forFeature('process', fromProcessReducers.getReducers()),
      ],
      providers: [
        SelectiveCartService,
        { provide: MultiCartService, useClass: MultiCartServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: UserService, useClass: UserServiceStup },
      ],
    });

    service = TestBed.get(SelectiveCartService as Type<SelectiveCartService>);
    multiCartService = TestBed.get(MultiCartService as Type<MultiCartService>);
    store = TestBed.get(Store as Type<
      Store<StateWithMultiCart | StateWithProcess<void>>
    >);
    service['cartId$'] = new BehaviorSubject<string>(TEST_CART_ID);
    service['cartSelector$'] = of({
      value: { code: TEST_CART_ID },
      loading: false,
      success: false,
      error: false,
    });
    spyOn(store, 'dispatch').and.stub();
  });

  it('should not return cart when loading', () => {
    spyOn(multiCartService, 'getCartEntity').and.returnValue(
      of({
        value: { code: TEST_CART_ID },
        loading: true,
        success: false,
        error: false,
      })
    );
    spyOn(multiCartService, 'loadCart').and.stub();
    let result;
    service
      .getCart()
      .subscribe(val => (result = val))
      .unsubscribe();
    expect(result).toEqual(undefined);
    expect(multiCartService.loadCart).toHaveBeenCalledTimes(0);
  });

  it('should not load selective cart for anonymous user', () => {
    spyOn<any>(service, 'load').and.callThrough();
    spyOn(multiCartService, 'loadCart').and.stub();
    spyOn(multiCartService, 'getCartEntity').and.returnValue(
      of({
        value: { code: TEST_CART_ID },
        loading: false,
        success: false,
        error: false,
      })
    );
    service['userId'] = OCC_USER_ID_ANONYMOUS;
    service
      .getCart()
      .subscribe()
      .unsubscribe();
    expect(service['load']).toHaveBeenCalledTimes(0);
    expect(multiCartService.loadCart).toHaveBeenCalledTimes(0);
  });

  it('should return selective cart', () => {
    spyOn<any>(service, 'load').and.callThrough();
    spyOn(multiCartService, 'loadCart').and.stub();
    let result;
    service
      .getCart()
      .subscribe(val => (result = val))
      .unsubscribe();
    expect(service['load']).toHaveBeenCalled();
    expect(result).toEqual({});
    expect(multiCartService.loadCart).toHaveBeenCalledWith({
      userId: 'current',
      cartId: 'selectivecart-test-customer-id',
    });
  });

  it('should return cart entries', () => {
    spyOn(multiCartService, 'getEntries').and.returnValue(of([mockCartEntry]));
    service
      .getCart()
      .subscribe()
      .unsubscribe();
    let result;
    service
      .getEntries()
      .subscribe(val => (result = val))
      .unsubscribe();

    expect(result).toEqual([mockCartEntry]);
    expect(multiCartService['getEntries']).toHaveBeenCalledWith(
      'selectivecart-test-customer-id'
    );
  });

  it('should add entry', () => {
    spyOn(multiCartService, 'addEntry').and.callThrough();
    service
      .getCart()
      .subscribe()
      .unsubscribe();

    service.addEntry('productCode', 2);

    expect(multiCartService['addEntry']).toHaveBeenCalledWith(
      OCC_USER_ID_CURRENT,
      'selectivecart-test-customer-id',
      'productCode',
      2
    );
  });

  it('should call multiCartService remove entry method with active cart', () => {
    service['cartId'] = 'cartId';
    service['userId'] = 'userId';
    spyOn(multiCartService, 'removeEntry').and.callThrough();

    service.removeEntry({
      entryNumber: 3,
    });
    expect(multiCartService['removeEntry']).toHaveBeenCalledWith(
      'userId',
      'cartId',
      3
    );
  });

  it('should call multiCartService update entry method with active cart', () => {
    service['cartId'] = 'cartId';
    service['userId'] = 'userId';
    spyOn(multiCartService, 'updateEntry').and.callThrough();

    service.updateEntry(1, 2);
    expect(multiCartService['updateEntry']).toHaveBeenCalledWith(
      'userId',
      'cartId',
      1,
      2
    );
  });

  it('should return entry by product code', () => {
    spyOn(multiCartService, 'getEntry').and.returnValue(of(mockCartEntry));
    service
      .getCart()
      .subscribe()
      .unsubscribe();

    let result;
    service
      .getEntry('code123')
      .subscribe(entry => (result = entry))
      .unsubscribe();

    expect(result).toEqual(mockCartEntry);
    expect(multiCartService['getEntry']).toHaveBeenCalledWith(
      'selectivecart-test-customer-id',
      'code123'
    );
  });

  describe('test private method', () => {
    it('should return true for undefined', () => {
      const result = service['isEmpty'](undefined);
      expect(result).toBe(true);
    });

    it('should return true for null', () => {
      const result = service['isEmpty'](null);
      expect(result).toBe(true);
    });

    it('should return true for empty object', () => {
      const result = service['isEmpty']({});
      expect(result).toBe(true);
    });

    it('should return false for correct cart', () => {
      const result = service['isEmpty']({ code: 'testCode' });
      expect(result).toBe(false);
    });

    it('should only return true after user change', () => {
      const result = service['isJustLoggedIn']('testUser');
      expect(result).toBe(true);
    });
  });
});
