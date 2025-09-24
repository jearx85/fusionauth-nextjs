import { FusionAuthClient } from '@fusionauth/typescript-client';

export const fusionAuthClient = new FusionAuthClient(
  process.env.FUSIONAUTH_API_KEY!,
  process.env.FUSIONAUTH_URL!
);

export const applicationId = process.env.FUSIONAUTH_APPLICATION_ID!;