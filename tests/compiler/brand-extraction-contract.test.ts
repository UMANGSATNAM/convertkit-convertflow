import { describe, it, expect } from 'vitest';
import { BrandExtractionService } from '../../app/services/core/BrandExtractionService';
import { mapAiDataToShopifyTheme } from '../../app/services/theme-engine/mapper.server';
import { generateMerchantTokens } from '../../app/services/theme-engine/compiler/css-resolver';

describe('Contract Test: Extraction & Mapper boundary -> CSS Token Resolver', () => {
  it('every key output by BrandExtractionService.mapToTokens() is consumed by generateMerchantTokens()', () => {
    const fakeExtractedData: any = {
      colors: {
        primary: '#C9A84C',
        secondary: '#1A1A1A',
        background: '#FFFFFF',
        text: '#111111'
      },
      typography: {
        headingFont: 'Playfair Display',
        bodyFont: 'Inter'
      }
    };

    const tokensPayload = BrandExtractionService.mapToTokens(fakeExtractedData, false);
    const resolvedCssTokens = generateMerchantTokens(tokensPayload);

    expect(resolvedCssTokens['--color-accent']).toBe('#C9A84C');
    expect(resolvedCssTokens['--color-background']).toBe('#FFFFFF');
    expect(resolvedCssTokens['--color-text']).toBe('#1A1A1A');
    expect(resolvedCssTokens['--color-surface']).toBe('#F4F4F4');
    expect(resolvedCssTokens['--font-heading-family']).toBe("'Playfair Display', sans-serif");
    expect(resolvedCssTokens['--font-body-family']).toBe("'Inter', sans-serif");
  });

  it('every key output by mapAiDataToShopifyTheme().settingsPatch is consumed by generateMerchantTokens()', () => {
    const fakeAiData: any = {
      sections: [],
      colors: {
        primary: '#ff0000',
        secondary: '#00ff00',
        background: '#ffffff',
        text: '#000000'
      },
      typography: {
        headingFont: 'Cinzel',
        bodyFont: 'Roboto'
      }
    };

    const { settingsPatch } = mapAiDataToShopifyTheme(fakeAiData);
    const resolvedCssTokens = generateMerchantTokens(settingsPatch);

    expect(resolvedCssTokens['--color-background']).toBe('#ffffff');
    expect(resolvedCssTokens['--color-text']).toBe('#000000');
    expect(resolvedCssTokens['--font-heading-family']).toBe("'Cinzel', sans-serif");
    expect(resolvedCssTokens['--font-body-family']).toBe("'Roboto', sans-serif");
  });
});
