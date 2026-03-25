import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/Repositories';

const userRepo = new UserRepository();
const SECRET = process.env.JWT_SECRET || 'supersecret';

export class AuthService {
    async register(name: string, email: string, password: string) {
        const existing = await userRepo.getUserByEmail(email);
        if (existing) throw new Error('User exists');
        
        const hash = await bcrypt.hash(password, 10);
        return await userRepo.createUser(name, email, hash);
    }

    async login(email: string, password: string) {
        const user = await userRepo.getUserByEmail(email);
        if (!user) throw new Error('Invalid credentials');
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid credentials');
        
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' });
        return { token, user: { id: user.id, name: user.name, email: user.email } };
    }
}
