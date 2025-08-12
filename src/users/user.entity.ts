import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'family_name' })
  familyName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ unique: true })
  cin: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;
  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  validationParEmailToken: string;
  @Column({ default: false })
  isActive: boolean;
  @CreateDateColumn()
  createdAt: Date;
@Column({ nullable: true })
resetPasswordToken: string;

@Column({ nullable: true, type: 'timestamptz' })
resetPasswordExpires: Date | null;
  @UpdateDateColumn()
  updatedAt: Date;
}
