import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailService: MailService, 
  ) {}
async create(dto: CreateUserDto): Promise<User> {
  const existingUser = await this.userRepo.findOne({
    where: [{ email: dto.email }, { cin: dto.cin }],
  });

  if (existingUser) {
    throw new ConflictException('Email or CIN already used');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  
  const validationToken = randomBytes(32).toString('hex');

  const user = this.userRepo.create({
    ...dto,
    password: hashedPassword,
    validationParEmailToken: validationToken,
    isActive: false,
  });

  const savedUser = await this.userRepo.save(user);
  await this.mailService.sendValidationEmail(savedUser.email, validationToken);
  return savedUser;
}
  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

async findById(id: number): Promise<User> {
  const user = await this.userRepo.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}
async findByEmail(email: string): Promise<User> {
  const user = await this.userRepo.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.userRepo.remove(user);
  }

  async countAdmins(): Promise<number> {
    return this.userRepo.count({ where: { role: UserRole.ADMIN } });
  }
  async update(id: number, dto: UpdateUserDto): Promise<User> {
  const user = await this.findById(id); // renvoie une erreur si non trouvé

  if (dto.password) {
    dto.password = await bcrypt.hash(dto.password, 10);
  }

  Object.assign(user, dto);

  return this.userRepo.save(user);
}


}
