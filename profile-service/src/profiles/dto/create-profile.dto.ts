export class CreateProfileDto {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly phoneNumber?: string;
  readonly about?: string;
  readonly address?: string;
}
