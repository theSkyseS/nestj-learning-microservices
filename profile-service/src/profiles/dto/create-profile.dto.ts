export class CreateProfileDto {
  readonly name: string;
  readonly phoneNumber?: string;
  readonly about?: string;
  readonly address?: string;
  readonly userId: number;
}
