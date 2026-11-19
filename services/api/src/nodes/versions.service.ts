import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Version } from "../entities/version.entity";
import { ItemNode } from "../entities/node.entity";
import type { UploadedFileVersion } from "./files.service";

@Injectable()
export class VersionsService {
  constructor(
    @InjectRepository(Version)
    private readonly repository: Repository<Version>,
  ) {}

  async getCurrentNodeVersion(nodeId: string): Promise<string> {
    const version = await this.repository.findOneByOrFail({
      node: { id: nodeId },
      isCurrent: true,
    });
    return version.nodeVersion;
  }

  async getAllVersionEntriesById(nodeId: string) {
    return this.repository.findBy({nodeId});
  }

  async createVersion(
    nodeId: string,
    uploadedFile: UploadedFileVersion,
  ): Promise<Version> {
    return this.repository.manager.transaction(async (manager) => {
      const node = await manager.findOneOrFail(ItemNode, {
        where: { id: nodeId },
        lock: { mode: "pessimistic_write" },
      });

      await manager.update(
        Version,
        { nodeId, isCurrent: true },
        { isCurrent: false },
      );

      const version = manager.create(Version, {
        node,
        nodeId,
        nodeVersion: uploadedFile.version,
        fileType: uploadedFile.fileType,
        isCurrent: true,
      });
      return manager.save(version);
    });
  }

  async deleteVersion(nodeId: string, nodeVersion: string) {
    const versionEntry = await this.repository.findOneByOrFail({
      nodeId,
      nodeVersion
    })
    return this.repository.remove(versionEntry);
  }
}