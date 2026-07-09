import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3Service.js";

export async function attachUserSignedUrls(data) {
    if (!data) return data;

    if (Array.isArray(data)) {
        await Promise.all(data.map(item => signSingleUser(item)));
        return data;
    }

    return await signSingleUser(data);
}

async function signSingleUser(user) {
    if (!user) return user;

    const signingPromises = [];

    if (user.profile_picture_url && !user.profile_picture_url.startsWith('http')) {
        const pPromise = getSignedUrl(s3, new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: user.profile_picture_url
        }), { expiresIn: 3600 })
        .then(url => { user.profile_picture_url = url; })
        .catch(err => console.error("S3 Signing Error (Profile):", err));
        
        signingPromises.push(pPromise);
    }

    if (user.profile_banner_url && !user.profile_banner_url.startsWith('http')) {
        const bPromise = getSignedUrl(s3, new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: user.profile_banner_url
        }), { expiresIn: 3600 })
        .then(url => { user.profile_banner_url = url; })
        .catch(err => console.error("S3 Signing Error (Banner):", err));
        
        signingPromises.push(bPromise);
    }

    await Promise.all(signingPromises);
    return user;
}