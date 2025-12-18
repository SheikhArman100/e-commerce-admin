
export type IRegisterFormData = {
    name: string
    userName: string
    email: string
    // phoneNumber: string
    // password: string
    image?: File
  }
  export type ISignInFormData = {
    email: string
    password: string
  }
  
  export type IChangePasswordFormData = {
    oldPassword: string
    newPassword: string,
    confirmNewPassword:string
  }
  
  export type IForgetPasswordFormData = {
    email: string
  }
export type IResetPasswordFormData = {
    newPassword: string
  }

export enum ENUM_USER_ROLE {
  ADMIN = 'admin',
  USER = 'user'
}

export interface IAuthUser {
  id: number;
  name: string;
  email: string;
  role: ENUM_USER_ROLE;
  isVerified: boolean;
  detail?: {
    profileImage: string | null;
    image?: {
      id: number;
      type: string;
      diskType: string;
      path: string;
      originalName: string;
      modifiedName: string;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  } | null;
}
  // export type IFormFieldProps = {
  //   type: string;
  //   placeholder: string;
  //   name:
  //     | 'firstName'
  //     | 'lastName'
  //     | 'email'
  //     | 'phoneNumber'
  //     | 'password'
  //     | 'role'
  //     | 'image';
  //   register: UseFormRegister<IRegisterFormData>;
  //   error: FieldError | undefined;
  //   valueAsNumber?: boolean;
  // };
  //     | 'image';
  //   register: UseFormRegister<IRegisterFormData>;
  //   error: FieldError | undefined;
  //   valueAsNumber?: boolean;
  // };
