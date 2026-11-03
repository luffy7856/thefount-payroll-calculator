import { defineConfig } from "@apps-in-toss/web-framework/config";

/* 더파운트 월급·인건비 계산기 on 앱인토스. appName must be exactly the name registered in the 앱인토스 console.
   The bundle is the static build in dist/ (vite build), fully offline: every number is computed on the device. */
export default defineConfig({
  appName: "thefount-payroll",
  brand: { primaryColor: "#102C42" },
  permissions: [],
  navigationBar: { withBackButton: true, withHomeButton: true, theme: "light" },
  webView: {
    bounces: false,
    pullToRefreshEnabled: false,
    overScrollMode: "never",
    allowsBackForwardNavigationGestures: false,
  },
  webBundleDir: "dist",
});
