import { NgModule } from '@angular/core';

import { OutletRefModule } from '../../outlet/index';
import { StyleRefModule } from '../../outlet/style-ref/style-ref.module';

import { MainModule } from './main/main.module';
import { OrderConfirmationPageLayoutModule } from './order-confirmation-page-layout/order-confirmation-page-layout.module';
import { RegisterLayoutModule } from './register-layout/register-layout.module';
import { StoreFinderPageLayoutModule } from './store-finder-page-layout/store-finder-page-layout.module';
import { BreakpointService } from './breakpoint/breakpoint.service';
import { ConfigModule, Config } from '@spartacus/core';

import { defaultLayoutConfig } from './config/default-layout-config';
import { LayoutConfig } from './config/layout-config';

const layoutModules = [
  OrderConfirmationPageLayoutModule,
  RegisterLayoutModule,
  StoreFinderPageLayoutModule,
  OutletRefModule,
  StyleRefModule
];

@NgModule({
  imports: [
    MainModule,
    ...layoutModules,
    ConfigModule.withConfig(defaultLayoutConfig)
  ],
  providers: [
    { provide: LayoutConfig, useExisting: Config },
    BreakpointService
  ],
  exports: [MainModule, ...layoutModules]
})
export class LayoutModule {}
