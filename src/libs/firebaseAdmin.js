const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "yumcycle-28083",
  private_key_id: "34781c34be5a4ca4603db0d49ebe954f43c39c9e",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXwpZ9A+E/h4GG\nXQbXRLaraZKHLVax6wg41wm7wbZTpjXbY2Mdzqx1UtfzC2mAUIcw5LY9LmFXyJpy\nEUifNFKWpUUPAcQdkDDDaKASFM24DRgeiQloDQtGjPjdtM/17CzRb5fuYKMOZboU\nXorVmuZ44TjWXCNN69U+WCsC27drFzfrBrLh9Rag4GTet1SDlbix9pjmfjxF6ww+\nVT8TqB2aPmmTsrLt3UH+IE6P2pcbY1tXbYiHlufqBJDIE0lemDrvcjd3/35cfiVQ\nGOSGDLw+jSHLTEWuedAbkYc+JgSwaxLP5xkq5yUU6Zw/0EjOgsGWaBHHxM62YTRs\ncLUggTS3AgMBAAECggEAByx2GnP9kkIsIU6IgrHLLQnWkF4GiuXYoSMtNKvtJvzY\nv5GfYwdTHpeBjJgtitGinRKNqJ0ZKXUHBZHjiz+PG2klUalqXt1DccvRvqgoat0s\nlx9RS79bR546TAzN+Uw/9Tqzn35hDYJ+XF0EWrPKw+whGqd3mQilT2xZCcBKaeoN\nFYjG1FOi0cPcRqR/rdrdkogFrFQvI+3Vvynoweigv83YwslBEK7B7o1U/FPCNeph\nr5AkF9Ttowk6AFKWwM8vwH4dOqu0W5qSTm+riHc5iQrgxupcZsQ5fpK6Z1Skidoy\nzl6IapGS1sd/dcReRlcwy3p/UJ4M6xlhzCL4N/+yaQKBgQDu1Z1xeIo7NvD7PM/v\nirTOueOEXFfV/RSuUJzNy5xug4v3lwDxMivKLqPJk9Zqv9sC9arZzUMFOaXAq2kC\nQ2lU8Zfm0J/G0xIbhnTHcdUaITIj7OAkVvOn0qg+4T2bh7AR2s9UhoAbQEgqixbF\nf/Ss9tcAzhZd8RjRsLbqOyU0vQKBgQDnRGvqOcgBbo4DPmulE9YOG5pIEwlxbquj\n8ypLeP3cYxwdjvYmivUvSSuCUoPvEZCdtF9ysjf8ijQpVgvIDtq2kLmRxAxMltLZ\nJd6f8QAQDJ+93R0kndL2Qop5lQ9uY0Taly6z8ogA+k3ERE/FfDO392lDXOnTNJ+S\nXw6xSbOYgwKBgQDm7hV2Ch9echlAU+SasXtyB7s92Cv19OdyRO/Y7O8szHUhyRhY\nHzLII6Cq4A+K2Edj7TZtslMDUmI6kYLPdW77ez5tJ3vWO3BevPtdfWuYAFEC+58e\nhBTESKP1aMSxBdnw6alfCU4FC3q76BD0lmx2cZYiaSKnYt+koUG76cRn4QKBgG9s\n7/GyVUMbWSEG+iZXIFM7yWHgijQ09k3P4xjp+qYsumcjckWvveJChswLpbWR6POS\n7En+xCrRC8C+zH5fadF8eWxZ4PMl2AD31gOJwlX5Px3jYx85S2OLO9zIjN7KxWns\nXXwl5pFSCBYAM88awHBqrDTgl2hDen6zfgi9UeKxAoGAKK/BJr1R68SYgXdOS0Zj\nhJmI+hbTK/K7RLtiSNqXLVrgH5ur769GkwWe57sFGre99RtpD7JsembLhlLa1PGh\nuwmq8EHQ8c5lXYgSQaIETOOqnr4uSBfKRKVTpww8jTtSQY9YgQG0yqCNpaP6huGi\nLBluKtfCEXjM0vSFQ30YS/g=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fbsvc@yumcycle-28083.iam.gserviceaccount.com",
  client_id: "113868226967120121621",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40yumcycle-28083.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

module.exports = admin;
