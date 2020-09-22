import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'
import User from '../models/User'
import { RequestToCreateUser } from '../interfaces/Users'
import AppError from '../errors/AppError'

class CreateUserService {
  public async execute({
    name,
    email,
    password,
  }: RequestToCreateUser): Promise<User> {
    const usersRepository = getRepository(User)

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    })

    if (checkUserExists) {
      throw new AppError('Email address already used.')
    }

    const hashedPassword = await hash(password, 8)

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    await usersRepository.save(user)

    return user
  }
}

export default CreateUserService
