import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { UpdateUserDto } from './dtos/update-user-dto';
import { CreateUserdto } from './dtos/create-user-dto';


describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;



  beforeEach(async () => {
    fakeUserService ={

      remove: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockImplementation((id: number, body: UpdateUserDto) => {
        return Promise.resolve({ id, ...body } as UserEntity);
      }),
      
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'asdf@asdf.com', password:'asdf' } as UserEntity);
      },
      find: (email: string) => {
        return Promise.resolve([{id:1,email,password:'asdf' } as UserEntity]);
      },
    };
    fakeAuthService ={
      signup: jest.fn().mockImplementation((email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as UserEntity);
      }),
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password} as UserEntity);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]

      
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given emaill ',async () => {
    const users = await controller.findAllusers('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com'); 
  });
  
  it('Find an User return a signle id with an given Id', async() => {
    const user = await controller.findUser('3');
    expect(user).toBeDefined();

  } )

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('SignIn updates session object and returns user', async() =>{
    const session ={ userId: -5};
    const user = await controller.signin({email: 'asdf@asdf.com', password: 'password'},session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('removeUser calls userService.remove() with correct id', async () => {
    const id = '1';
    await controller.removeUser(id);
    expect(fakeUserService.remove).toHaveBeenCalledWith(parseInt(id));
  });

  it('updateUser calls userService.update() with correct id and body', async () => {
    const id = '1';
    const body: UpdateUserDto = { email: 'updated@example.com', password: 'updatedPassword' };
    const updatedUser = await controller.updateUser(id, body);
    expect(fakeUserService.update).toHaveBeenCalledWith(parseInt(id), body);
    expect(updatedUser).toEqual({ id: 1, ...body });
  });

  it('createUser calls authService.signup() and sets session.userId', async () => {
    const createUserDto: CreateUserdto = { email: 'test@example.com', password: 'password123' };
    const session = { userId: Number};
    const createdUser = await controller.createUser(createUserDto, session);
    expect(fakeAuthService.signup).toHaveBeenCalledWith(createUserDto.email, createUserDto.password);
    expect(createdUser).toEqual({ id: 1, ...createUserDto });
    expect(session.userId).toEqual(createdUser.id);
  });

  it('whoami returns the user from CurrentUser', () => {
    const user: UserEntity = {
      id: 1, email: 'test@example.com', password: 'password123',
      logInsert: function (): void {
        throw new Error('Function not implemented.');
      },
      logUpdate: function (): void {
        throw new Error('Function not implemented.');
      },
      logRemove: function (): void {
        throw new Error('Function not implemented.');
      }
    };
    expect(controller.whoami(user)).toEqual(user);
  });
});

