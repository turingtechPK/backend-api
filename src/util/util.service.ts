import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  constructor() {}

  extractUrlForNextPage(linkHeader: string): string | undefined {
    return this.extractUrlFromLinkHeader(linkHeader, 'next');
  }

  extractUrlForLastPage(linkHeader: string): string | undefined {
    return this.extractUrlFromLinkHeader(linkHeader, 'last');
  }

  extractUrlFromLinkHeader(
    linkHeader: string,
    pageType: string,
  ): string | undefined {
    if (linkHeader) {
      const links = linkHeader.split(',');

      for (const link of links) {
        const [url, params] = link.split(';');
        const relMatch = params.match(/rel="([^"]+)"/);

        if (relMatch && relMatch[1].trim() === pageType) {
          return url.trim().slice(1, -1);
        }
      }
    }
    return undefined;
  }
}
