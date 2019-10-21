import { Component, Input, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Product } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CurrentProductService } from '../current-product.service';
import { ProductImagesComponent } from './product-images.component';

const firstImage = {
  zoom: {
    url: 'zoom-1.jpg',
  },
  thumbnail: {
    url: 'thumb-1.jpg',
  },
};
const secondImage = {
  zoom: {
    url: 'zoom-2.jpg',
  },
  thumbnail: {
    url: 'thumb-2.jpg',
  },
};

const mockDataWithOnePicture: Product = {
  name: 'mockProduct2',
  images: {
    PRIMARY: firstImage,
    GALLERY: [firstImage],
  },
};

const mockDataWithMultiplePictures: Product = {
  name: 'mockProduct1',
  images: {
    PRIMARY: firstImage,
    GALLERY: [firstImage, secondImage],
  },
};

class MockCurrentProductService {
  getProduct(): Observable<Product> {
    return of();
  }
}

@Component({
  selector: 'cx-media',
  template: '',
})
class MockMediaComponent {
  @Input() container;
}

@Component({
  selector: 'cx-carousel',
  template: `
    <ng-container *ngFor="let item$ of items">
      <ng-container
        *ngTemplateOutlet="template; context: { item: item$ | async }"
      ></ng-container>
    </ng-container>
  `,
})
class MockCarouselComponent {
  @Input() items;
  @Input() itemWidth;
  @Input() template;
  @Input() hideIndicators;
}

describe('ProductImagesComponent', () => {
  let component: ProductImagesComponent;
  let fixture: ComponentFixture<ProductImagesComponent>;
  let currentProductService: CurrentProductService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductImagesComponent,
        MockMediaComponent,
        MockCarouselComponent,
      ],
      providers: [
        {
          provide: CurrentProductService,
          useClass: MockCurrentProductService,
        },
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    currentProductService = TestBed.get(CurrentProductService as Type<
      CurrentProductService
    >);
  });

  describe('with multiple pictures', () => {
    beforeEach(() => {
      spyOn(currentProductService, 'getProduct').and.returnValue(
        of(mockDataWithMultiplePictures)
      );

      fixture = TestBed.createComponent(ProductImagesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should have mainImage$', () => {
      let result: any;
      component.mainImage$.subscribe(value => (result = value)).unsubscribe();
      expect(result.zoom.url).toEqual('zoom-1.jpg');
    });

    it('should have 2 thumbnails', async(() => {
      let items: Observable<Product>[];
      component.thumbs$.subscribe(i => (items = i));
      expect(items.length).toBe(2);
    }));

    it('should have thumb with url in first product', async(() => {
      let thumbs: Observable<Product>[];
      component.thumbs$.subscribe(i => (thumbs = i));
      let thumb: any;
      thumbs[0].subscribe(p => (thumb = p));
      expect(thumb.container.thumbnail.url).toEqual('thumb-1.jpg');
    }));

    describe('UI test', () => {
      it('should have cx-carousel element', () => {
        const carousel = fixture.debugElement.query(By.css('cx-carousel'));
        expect(carousel).toBeTruthy();
      });

      it('should have 2 rendered templates', async(() => {
        const el = fixture.debugElement.queryAll(
          By.css('cx-carousel cx-media')
        );
        expect(el.length).toEqual(2);
      }));
    });
  });

  describe('with one pictures', () => {
    beforeEach(() => {
      spyOn(currentProductService, 'getProduct').and.returnValue(
        of(mockDataWithOnePicture)
      );

      fixture = TestBed.createComponent(ProductImagesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should have mainImage$', () => {
      let result: any;
      component.mainImage$.subscribe(value => (result = value)).unsubscribe();
      expect(result.zoom.url).toEqual('zoom-1.jpg');
    });

    it('should not have thumbnails in case there is only one GALLERY image', async(() => {
      let items: Observable<Product>[];
      component.thumbs$.subscribe(i => (items = i));
      expect(items.length).toBe(0);
    }));

    describe('(UI test)', () => {
      it('should not render cx-carousel for one GALLERY image', () => {
        const carousel = fixture.debugElement.queryAll(
          By.css('cx-carousel cx-media')
        );
        expect(carousel.length).toEqual(0);
      });
    });

    describe('Product Detail Page', () => {
      it('should not render the carousel if it is empty', () => {
        expect(component.isEmpty).toBe(true);
      });
    });
  });
});
