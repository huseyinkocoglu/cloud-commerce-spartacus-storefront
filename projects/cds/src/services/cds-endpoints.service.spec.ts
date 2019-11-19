import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CdsConfig } from '../config/cds-config';
import { CdsEndpointsService } from './cds-endpoints.service';

describe('CdsEndpointsService', () => {
  const STRATEGY_PRODUCTS_ENDPOINT_KEY = 'strategyProducts';
  const STRATEGY_ID = 'test-strategy-id';

  const MOCK_CDS_CONFIG = {
    cds: {
      tenant: 'merchandising-strategy-adapter-test-tenant',
      baseUrl: 'http://some-cds-base-url',
      endpoints: {
        strategyProducts:
          '/strategy/${tenant}/strategies/${strategyId}/products',
      },
    },
  } as CdsConfig;

  const FULLY_CALCULATED_URL = `${MOCK_CDS_CONFIG.cds.baseUrl}/strategy/${MOCK_CDS_CONFIG.cds.tenant}/strategies/${STRATEGY_ID}/products`;

  let cdsEndpointsService: CdsEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CdsConfig, useValue: MOCK_CDS_CONFIG }],
    });

    cdsEndpointsService = TestBed.get(CdsEndpointsService as Type<
      CdsEndpointsService
    >);
  });

  it('should be created', () => {
    expect(cdsEndpointsService).toBeTruthy();
  });

  describe('getUrl', () => {
    it('should prepend a known endpoint with the base url, but not replace palceholders when none are provided', () => {
      expect(cdsEndpointsService.getUrl(STRATEGY_PRODUCTS_ENDPOINT_KEY)).toBe(
        `${MOCK_CDS_CONFIG.cds.baseUrl}/strategy/${MOCK_CDS_CONFIG.cds.tenant}/strategies/\${strategyId}/products`
      );
    });

    it('should prepend a known endpoint with the base url and replace provided placeholders', () => {
      expect(
        cdsEndpointsService.getUrl(STRATEGY_PRODUCTS_ENDPOINT_KEY, {
          strategyId: STRATEGY_ID,
        })
      ).toBe(FULLY_CALCULATED_URL);
    });

    it('should allow the tenant path parameter to be overridden', () => {
      const ALTERNATIVE_TENANT = 'some-other-tenant';
      expect(
        cdsEndpointsService.getUrl(STRATEGY_PRODUCTS_ENDPOINT_KEY, {
          strategyId: STRATEGY_ID,
          tenant: ALTERNATIVE_TENANT,
        })
      ).toBe(
        `${MOCK_CDS_CONFIG.cds.baseUrl}/strategy/${ALTERNATIVE_TENANT}/strategies/${STRATEGY_ID}/products`
      );
    });

    it('should not replace provided placeholders that are not in the endpoint pattern', () => {
      expect(
        cdsEndpointsService.getUrl(STRATEGY_PRODUCTS_ENDPOINT_KEY, {
          strategyId: STRATEGY_ID,
          someOtherField: 'someOtherField',
        })
      ).toBe(FULLY_CALCULATED_URL);
    });

    it('should prepend an unknown endpoint with the base url', () => {
      const UNKNOWN_ENDPOINT_KEY =
        '/some-other-url-with-placeholders/${placeHolder1}/${placeHolder2}';
      expect(
        cdsEndpointsService.getUrl(UNKNOWN_ENDPOINT_KEY, {
          placeHolder1: 'value1',
          placeHolder2: 'value2',
        })
      ).toBe(
        `${MOCK_CDS_CONFIG.cds.baseUrl}/some-other-url-with-placeholders/value1/value2`
      );
    });

    it('should not prepend an endpoint that already has the configured base url with the configured base url', () => {
      expect(cdsEndpointsService.getUrl(FULLY_CALCULATED_URL)).toBe(
        FULLY_CALCULATED_URL
      );
    });

    it('should not prepend an endpoint that already has the configured base url with the configured base url, but should replace placeholders', () => {
      expect(
        cdsEndpointsService.getUrl(
          `${MOCK_CDS_CONFIG.cds.baseUrl}${MOCK_CDS_CONFIG.cds.endpoints.strategyProducts}`,
          { strategyId: STRATEGY_ID }
        )
      ).toBe(FULLY_CALCULATED_URL);
    });

    it('should escape special characters passed in url params', () => {
      expect(
        cdsEndpointsService.getUrl(STRATEGY_PRODUCTS_ENDPOINT_KEY, {
          strategyId: 'ąćę$%',
        })
      ).toBe(
        `${MOCK_CDS_CONFIG.cds.baseUrl}/strategy/${MOCK_CDS_CONFIG.cds.tenant}/strategies/%C4%85%C4%87%C4%99%24%25/products`
      );
    });
  });
});
