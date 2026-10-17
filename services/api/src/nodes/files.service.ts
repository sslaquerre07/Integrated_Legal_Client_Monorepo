import { Injectable, OnModuleInit } from "@nestjs/common";
import { Bucket, Storage } from "@google-cloud/storage";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FilesService implements OnModuleInit {
    private storage!: Storage;
    private bucket!: Bucket;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        const projectId = this.configService.get<string>("GCP_PROJECT_ID");
        const bucketName = this.configService.get<string>("STORAGE_BUCKET_NAME");
        if (!projectId || !bucketName) {
            throw new Error("GCP_PROJECT_ID and STORAGE_BUCKET_NAME must be set in the environment variables.");
        }
        this.storage = new Storage();
        this.bucket = this.storage.bucket(bucketName);
    }

    uploadFile(file: Express.Multer.File, nodeId: string): Promise<string> {
        const blob = this.bucket.file(nodeId);
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype,
        });

        return new Promise((resolve, reject) => {
            blobStream.on("error", (err) => {
                reject(err);
            });

            blobStream.on("finish", () => {
                const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;
                resolve(publicUrl);
            });

            blobStream.end(file.buffer);
        });
    }

    async deleteFile(nodeId: string): Promise<void> {
        const blob = this.bucket.file(nodeId);
        try {
            await blob.delete();
        } catch (error) {
            const code =
                typeof error === "object" && error !== null && "code" in error
                    ? error.code
                    : undefined;
            if (code === 404 || code === "404") {
                return;
            }
            throw error;
        }
    }
  // Implement file-related operations here
}