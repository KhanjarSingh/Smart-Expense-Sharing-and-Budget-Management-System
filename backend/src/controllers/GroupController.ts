import { Request, Response } from 'express';
import { GroupRepository } from '../repositories/Repositories';

const groupRepo = new GroupRepository();

export class GroupController {
    async createGroup(req: Request, res: Response) {
        try {
            const { name } = req.body;
            const createdBy = (req as any).user.id;
            const group = await groupRepo.createGroup(name, createdBy);
            res.status(201).json(group);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getGroups(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const groups = await groupRepo.getUserGroups(userId);
            res.status(200).json(groups);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async joinGroup(req: Request, res: Response) {
        try {
            const { groupId } = req.body;
            const userId = (req as any).user.id;
            const result = await groupRepo.addMember(parseInt(groupId), userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getGroupDetails(req: Request, res: Response) {
        try {
            const { groupId } = req.params;
            const members = await groupRepo.getGroupMembers(parseInt(groupId as string));
            res.status(200).json({ members });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
