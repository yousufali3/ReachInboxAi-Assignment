import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { ConfidentialClientApplication } from "@azure/msal-node";

dotenv.config();
const router = express.Router();
export { router as outlookRouter };

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: process.env.AZURE_AUTHORITY,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
};

const pca = new ConfidentialClientApplication(msalConfig);

router.get("/auth/azure", (req: Request, res: Response) => {
  const authCodeUrlParams = {
    scopes: ["openid", "profile", "User.Read"],
    redirectUri: process.env.AZURE_REDIRECT_URI,
  };

  pca
    .getAuthCodeUrl(authCodeUrlParams)
    .then((response) => {
      res.redirect(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error generating auth URL.");
    });
});

router.get("/auth/azure/callback", (req: Request, res: Response) => {
  const tokenRequest = {
    code: req.query.code as string,
    scopes: ["openid", "profile", "User.Read"],
    redirectUri: process.env.AZURE_REDIRECT_URI,
  };

  pca
    .acquireTokenByCode(tokenRequest)
    .then((response) => {
      const maskedResponse = {
        ...response,
        accessToken: "**********",
        idToken: "**********",
        tenantId: "**********",
        idTokenClaims: {
          ...(response.idTokenClaims as any),
          aud: "**********",
          iss: "**********",
          iat: "**********",
          nbf: "**********",
          exp: "**********",
          idp: "**********",
          name: "**********",
          oid: "**********",
          prov_data:
            (response.idTokenClaims as any).prov_data?.map((data: any) => ({
              ...data,
              altsecid: "**********",
            })) || [],
          rh: "**********",
          sub: "**********",
          tid: "**********",
          uti: "**********",
          ver: "**********",
        },
        account: {
          ...response.account,
          homeAccountId: "**********",
          environment: "**********",
          tenantId: "**********",
          localAccountId: "**********",
        },
        uniqueId: "**********",
        correlationId: "**********",
        requestId: "**********",
        expiresOn: response.expiresOn,
        extExpiresOn: response.extExpiresOn,
        fromCache: response.fromCache,
        tokenType: response.tokenType,
        state: response.state,
        cloudGraphHostName: response.cloudGraphHostName,
        msGraphHost: response.msGraphHost,
        fromNativeBroker: response.fromNativeBroker,
        familyId: response.familyId,
      };

      console.log("Token acquired:", maskedResponse);

      res.send(
        `<pre>Login successful! Token: ${JSON.stringify(
          maskedResponse,
          null,
          2
        )}</pre>`
      );
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error during token acquisition.");
    });
});
