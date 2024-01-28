import { config } from 'dotenv';
config();
import admin from 'firebase-admin';
// import ErrorHandler from '../middleware/ErrorHandler';

const serviceAccount = {
  type: process.env.FIREBASE_ADMIN_TYPE,
  project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
  private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'), // private_key o'zgaruvchisini to'g'irlash
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
  token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509,
  universe_domain: process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIRABASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();



export async function uploadFileToFirebaseStorage(file) {
    try {
      const { buffer, originalname } = file;
      const fileRef = bucket.file(`images/${originalname}`);
  
      await fileRef.save(buffer);
  
      const [url] = await fileRef.getSignedUrl({
        action: "read",
        expires: "01-01-2035",
      });
  
      return {
        url,
        public_id: originalname,
      };
    } catch (error) {
      console.log(error)
      throw error
    //  return new ErrorHandler('Firebase storage upload error',400);
    }
  }

export async function deleteFileFromFirebaseStorage(fileName) {
    const file = bucket.file(`images/${fileName}`);

    await file.delete().then((res) => {
      if(res){
        return {
          success: true,
        };
      }
    })
}

export async function getImageUrl(fileName) {
  const file = bucket.file(fileName);
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "01-01-2035",
  });
  return { url, public_id: fileName };
}


