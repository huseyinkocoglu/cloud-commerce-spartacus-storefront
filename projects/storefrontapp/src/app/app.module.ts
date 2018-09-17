import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MainComponent, StorefrontModule } from 'storefrontlib';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    StorefrontModule.withConfig({
      server: {
        baseUrl: environment.occBaseUrl,
        occPrefix: '/rest/v2/'
      }
    })
  ],
  bootstrap: [MainComponent]
})
export class AppModule {}
