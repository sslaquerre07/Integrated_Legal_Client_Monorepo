import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Not, Repository } from "typeorm";
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

  async getNewerVersions(nodeId: string, nodeVersion: string): Promise<Version[]> {
    const targetVersion = await this.repository.findOneBy({
      nodeId,
      nodeVersion,
    });

    if (!targetVersion) {
      throw new BadRequestException("Version not found for this file.");
    }

    return this.repository.find({
      where: {
        nodeId,
        nodeVersion: Not(nodeVersion),
        createdAt: MoreThan(targetVersion.createdAt),
      },
      order: { createdAt: "ASC" },
    });
  }

  async findAndSetNewCurrentVersion(nodeId: string): Promise<string> {
    const mostRecentVersion = await this.repository.findOne({
      where: { nodeId },
      order: { createdAt: "DESC" },
    });

    if (!mostRecentVersion)
      throw new InternalServerErrorException("Unable to set new is_current");
    
    await this.repository.update(
      { nodeId, nodeVersion: mostRecentVersion.nodeVersion },
      { isCurrent: true },
    );
    return mostRecentVersion.nodeVersion;
  }

  async createVersion(
    nodeId: string,
    uploadedFile: UploadedFileVersion,
  ): Promise<Version> {
    // Pessimistically updates the is_current. If the upload of the new version fails,
    // the old is_current retains it status
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