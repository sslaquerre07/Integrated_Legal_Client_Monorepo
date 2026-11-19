import { Injectable, InternalServerErrorException, OnModuleInit } from "@nestjs/common";
import { Bucket, Storage } from "@google-cloud/storage";
import { ConfigService } from "@nestjs/config";

export interface UploadedFileVersion {
    name: string
    version: string
    fileType: string
}

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

    retrieveFileStream(nodeId: string, nodeVersion: string) {
        const blob = this.bucket.file(nodeId, {
            generation: nodeVersion
        });
        return blob.createReadStream();
    }

    async retrieveAllFileVersions(nodeId: string) {
        return this.bucket.getFiles({
            prefix: nodeId,
            versions: true
        })
    }

    async uploadFile(file: Express.Multer.File, nodeId: string, expectedCurrentVersion?: string): Promise<UploadedFileVersion> {
        const blob = this.bucket.file(nodeId);
        await blob.save(file.buffer, {
            resumable: false,
            contentType: file.mimetype,
            // Fails with a 412 Precondition Failed error if someone else 
            // uploaded a newer version in the meantime
            ...(expectedCurrentVersion && {
                preconditionOpts: {
                    ifGenerationMatch: Number(expectedCurrentVersion),
                },
            }),
        });

        const generation = blob.metadata.generation;
        if (generation == null) {
        throw new Error("Unable to retrieve object version");
        }

        return {
        name: blob.name,
        version: String(generation),
        fileType: file.mimetype,
        };
    }

    async deleteFile(nodeId: string, nodeVersion: string): Promise<void> {
        const blob = this.bucket.file(nodeId, {
            generation: nodeVersion
        });
        try {
            await blob.delete();
        } catch (error) {
            // A delete on a missing object is already a success since 
            // the object is gone already
            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                (error.code === 404 || error.code === "404")
            ) {
                return;
            }
            throw new InternalServerErrorException(`Version ${nodeVersion} failed to be deleted`);
        }
    }
}