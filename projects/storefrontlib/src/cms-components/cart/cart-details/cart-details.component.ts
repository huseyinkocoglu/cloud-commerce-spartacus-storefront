import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  Cart,
  CartService,
  OrderEntry,
  SelectiveCartService,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Item } from '../cart-shared/cart-item/cart-item.component';

@Component({
  selector: 'cx-cart-details',
  templateUrl: './cart-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDetailsComponent implements OnInit {
  cart$: Observable<Cart>;
  entries$: Observable<OrderEntry[]>;
  cartLoaded$: Observable<boolean>;

  constructor(
    protected cartService: CartService,
    protected selecttiveCartService: SelectiveCartService
  ) {}

  ngOnInit() {
    this.cart$ = this.cartService.getActive();
    this.entries$ = this.cartService
      .getEntries()
      .pipe(filter(entries => entries.length > 0));
    this.cartLoaded$ = this.cartService.getLoaded();
  }

  getAllPromotionsForCart(cart: Cart): any[] {
    const potentialPromotions = [];
    potentialPromotions.push(...(cart.potentialOrderPromotions || []));
    potentialPromotions.push(...(cart.potentialProductPromotions || []));

    const appliedPromotions = [];
    appliedPromotions.push(...(cart.appliedOrderPromotions || []));
    appliedPromotions.push(...(cart.appliedProductPromotions || []));

    return [...potentialPromotions, ...appliedPromotions];
  }

  saveForLater(item: Item) {
    this.cartService.removeEntry(item);
    this.selecttiveCartService.addEntry(item.product.code, item.quantity);
  }
}
