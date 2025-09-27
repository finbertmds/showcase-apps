import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { AddEnumOptionInput, CreateEnumInput, UpdateEnumInput, UpdateEnumOptionInput } from '../../dto/enum.dto';
import { App, AppDocument } from '../../schemas/app.schema';
import { Enum, EnumDocument } from '../../schemas/enum.schema';
import { Organization, OrganizationDocument } from '../../schemas/organization.schema';
import { User, UserDocument } from '../../schemas/user.schema';

// Default enum values from enum-display.ts
const DEFAULT_ENUMS = {
  APP_PLATFORM: [
    { value: 'WEB', label: 'Web' },
    { value: 'MOBILE', label: 'Mobile' },
    { value: 'DESKTOP', label: 'Desktop' },
    { value: 'API', label: 'API' },
    { value: 'IOS', label: 'iOS' },
    { value: 'ANDROID', label: 'Android' },
  ],
  APP_LANGUAGE: [
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'TypeScript', label: 'TypeScript' },
    { value: 'Python', label: 'Python' },
    { value: 'Java', label: 'Java' },
    { value: 'C#', label: 'C#' },
    { value: 'C++', label: 'C++' },
    { value: 'Go', label: 'Go' },
    { value: 'Rust', label: 'Rust' },
    { value: 'Swift', label: 'Swift' },
    { value: 'Kotlin', label: 'Kotlin' },
    { value: 'Dart', label: 'Dart' },
    { value: 'PHP', label: 'PHP' },
    { value: 'Ruby', label: 'Ruby' },
    { value: 'React', label: 'React' },
    { value: 'Vue', label: 'Vue' },
    { value: 'Angular', label: 'Angular' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Express', label: 'Express' },
    { value: 'Django', label: 'Django' },
    { value: 'Flask', label: 'Flask' },
    { value: 'Spring', label: 'Spring' },
    { value: 'Laravel', label: 'Laravel' },
    { value: 'Rails', label: 'Rails' },
  ],
};

@Injectable()
export class EnumService {
  constructor(
    @InjectModel(Enum.name) private enumModel: Model<EnumDocument>,
    @InjectModel(App.name) private appModel: Model<AppDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
  ) {}

  /**
   * Helper method to create enum options with IDs
   */
  private createOptionsWithIds(options: { value: string; label: string; id?: string }[]): any[] {
    return options.map(option => ({
      id: option.id || randomUUID(),
      value: option.value,
      label: option.label,
    }));
  }

  async onModuleInit() {
    await this.seedDefaultEnums();
  }

  private async seedDefaultEnums() {
    try {
      for (const [key, options] of Object.entries(DEFAULT_ENUMS)) {
        const existingEnum = await this.enumModel.findOne({ key }).exec();
        if (!existingEnum) {
          await this.enumModel.create({
            key,
            options: this.createOptionsWithIds(options as any),
          });
          console.log(`Seeded default enum: ${key}`);
        }
      }
    } catch (error) {
      console.error('Error seeding default enums:', error);
    }
  }

  async findAll(): Promise<EnumDocument[]> {
    return this.enumModel.find().sort({ key: 1 }).exec();
  }

  async findByKey(key: string): Promise<EnumDocument> {
    const enumDoc = await this.enumModel.findOne({ key }).exec();
    if (!enumDoc) {
      throw new NotFoundException(`Enum with key "${key}" not found`);
    }
    return enumDoc;
  }

  async create(createEnumInput: CreateEnumInput): Promise<EnumDocument> {
    const existingEnum = await this.enumModel.findOne({ key: createEnumInput.key }).exec();
    if (existingEnum) {
      throw new ConflictException(`Enum with key "${createEnumInput.key}" already exists`);
    }

    // Validate unique values
    const values = createEnumInput.options.map(option => option.value);
    const uniqueValues = new Set(values);
    if (values.length !== uniqueValues.size) {
      throw new BadRequestException('Enum values must be unique');
    }

    return this.enumModel.create({
      key: createEnumInput.key,
      options: this.createOptionsWithIds(createEnumInput.options as any),
    });
  }

  async update(key: string, updateEnumInput: UpdateEnumInput): Promise<EnumDocument> {
    const enumDoc = await this.findByKey(key);
    
    // Validate unique values
    const values = updateEnumInput.options.map(option => option.value);
    const uniqueValues = new Set(values);
    if (values.length !== uniqueValues.size) {
      throw new BadRequestException('Enum values must be unique');
    }

    // Store old options for data migration
    const oldOptions = [...enumDoc.options];
    
    // Process options with IDs
    const processedOptions = this.createOptionsWithIds(updateEnumInput.options as any);
    
    enumDoc.options = processedOptions;
    enumDoc.updatedAt = new Date();
    
    const updatedEnum = await enumDoc.save();
    
    // Update related data if enum values changed
    await this.migrateEnumData(key, oldOptions, processedOptions);
    
    return updatedEnum;
  }

  async addOption(key: string, addOptionInput: AddEnumOptionInput): Promise<EnumDocument> {
    const enumDoc = await this.findByKey(key);
    
    // Check if value already exists
    const existingOption = enumDoc.options.find(option => option.value === addOptionInput.value);
    if (existingOption) {
      throw new ConflictException(`Option with value "${addOptionInput.value}" already exists`);
    }

    const newOption = this.createOptionsWithIds([addOptionInput])[0];
    enumDoc.options.push(newOption);
    enumDoc.updatedAt = new Date();
    
    return enumDoc.save().then(saved => saved);
  }

  async updateOption(key: string, id: string, updateOptionInput: UpdateEnumOptionInput): Promise<EnumDocument> {
    const enumDoc = await this.findByKey(key);
    
    const optionIndex = enumDoc.options.findIndex(option => option.id === id);
    if (optionIndex === -1) {
      throw new NotFoundException(`Option with id "${id}" not found`);
    }

    // update the option
    enumDoc.options[optionIndex] = {
      id: id,
      value: updateOptionInput.value,
      label: updateOptionInput.label,
    };
    enumDoc.updatedAt = new Date();
    
    const updatedEnum = await enumDoc.save();
    
    return updatedEnum;
  }

  async removeOption(key: string, id: string): Promise<EnumDocument> {
    const enumDoc = await this.findByKey(key);
    
    const optionIndex = enumDoc.options.findIndex(option => option.id === id);
    if (optionIndex === -1) {
      throw new NotFoundException(`Option with id "${id}" not found`);
    }

    enumDoc.options.splice(optionIndex, 1);
    enumDoc.updatedAt = new Date();
    
    return enumDoc.save().then(saved => saved);
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.enumModel.deleteOne({ key }).exec();
    return result.deletedCount > 0;
  }

  async resetToDefault(key: string): Promise<EnumDocument> {
    const defaultOptions = DEFAULT_ENUMS[key as keyof typeof DEFAULT_ENUMS];
    if (!defaultOptions) {
      throw new NotFoundException(`No default enum found for key "${key}"`);
    }

    const optionsWithIds = this.createOptionsWithIds(defaultOptions as any);

    const enumDoc = await this.enumModel.findOne({ key }).exec();
    if (!enumDoc) {
      // Create new enum with default values
      return this.enumModel.create({
        key,
        options: optionsWithIds,
      });
    }

    enumDoc.options = optionsWithIds;
    enumDoc.updatedAt = new Date();
    
    return enumDoc.save().then(saved => saved);
  }

  async resetAllToDefault(): Promise<void> {
    for (const [key, options] of Object.entries(DEFAULT_ENUMS)) {
      const optionsWithIds = this.createOptionsWithIds(options as any);
      const enumDoc = await this.enumModel.findOne({ key }).exec();
      if (enumDoc) {
        enumDoc.options = optionsWithIds;
        enumDoc.updatedAt = new Date();
        await enumDoc.save();
      } else {
        const newEnum = await this.enumModel.create({
          key,
          options: optionsWithIds,
        });
        // No need to return toObject() here since this method returns void
      }
    }
  }

  /**
   * Migrate enum data when enum values change
   */
  private async migrateEnumData(key: string, oldOptions: any[], newOptions: any[]): Promise<void> {
    // Create mapping of old to new values
    const valueMapping = new Map<string, string>();

    for (const oldOption of oldOptions) {
      const newOption = newOptions.find(opt => opt.label === oldOption.label);
      if (newOption && oldOption.value !== newOption.value) {
        valueMapping.set(oldOption.value, newOption.value);
      }
    }

    if (valueMapping.size === 0) {
      console.log(`No value changes detected for enum: ${key}`);
      return;
    }

    console.log(`Migrating enum ${key}:`, Object.fromEntries(valueMapping));

    // Update related collections based on enum type
    switch (key) {
      case 'APP_STATUS':
        await this.migrateAppStatus(valueMapping);
        break;
      case 'APP_VISIBILITY':
        await this.migrateAppVisibility(valueMapping);
        break;
      case 'APP_PLATFORM':
        await this.migrateAppPlatform(valueMapping);
        break;
      case 'USER_ROLE':
        await this.migrateUserRole(valueMapping);
        break;
      case 'USER_STATUS':
        await this.migrateUserStatus(valueMapping);
        break;
      case 'ORGANIZATION_STATUS':
        await this.migrateOrganizationStatus(valueMapping);
        break;
      default:
        console.log(`No migration needed for enum: ${key}`);
    }

    console.log(`Migration completed for enum: ${key}`);
  }

  /**
   * Migrate single enum value
   */
  private async migrateEnumValue(key: string, oldValue: string, newValue: string): Promise<void> {
    const valueMapping = new Map<string, string>();
    valueMapping.set(oldValue, newValue);
    await this.migrateEnumData(key, [{ value: oldValue }], [{ value: newValue }]);
  }

  private async migrateAppStatus(valueMapping: Map<string, string>): Promise<void> {
    for (const [oldValue, newValue] of valueMapping) {
      const result = await this.appModel.updateMany(
        { status: oldValue },
        { $set: { status: newValue } }
      ).exec();
      console.log(`Updated ${result.modifiedCount} apps with status ${oldValue} → ${newValue}`);
    }
  }

  private async migrateAppVisibility(valueMapping: Map<string, string>): Promise<void> {
    for (const [oldValue, newValue] of valueMapping) {
      const result = await this.appModel.updateMany(
        { visibility: oldValue },
        { $set: { visibility: newValue } }
      ).exec();
      console.log(`Updated ${result.modifiedCount} apps with visibility ${oldValue} → ${newValue}`);
    }
  }

  private async migrateAppPlatform(valueMapping: Map<string, string>): Promise<void> {
    for (const [oldValue, newValue] of valueMapping) {
      // Find apps that have the old platform value
      const appsWithOldValue = await this.appModel.find({ platforms: oldValue }).exec();

      console.log(`Apps with old platform ${oldValue}:`, appsWithOldValue);
      if (appsWithOldValue.length === 0) {
        console.log(`No apps found with platform ${oldValue}`);
        continue;
      }
      
      console.log(`Apps with new platform ${newValue}:`, appsWithOldValue);

      // Update each app individually to avoid MongoDB conflicts
      let updatedCount = 0;
      for (const app of appsWithOldValue) {
        // Remove old value and add new value if not already present
        const updatedApp = await this.appModel.findByIdAndUpdate(
          app._id,
          {
            $pull: { platforms: oldValue },
            $addToSet: { platforms: newValue }
          },
          { new: true }
        ).exec();
        
        if (updatedApp) {
          updatedCount++;
        }
      }
      
      console.log(`Updated platforms ${oldValue} → ${newValue}: ${updatedCount}/${appsWithOldValue.length} apps updated`);
    }
  }

  private async migrateUserRole(valueMapping: Map<string, string>): Promise<void> {
    for (const [oldValue, newValue] of valueMapping) {
      await this.userModel.updateMany(
        { role: oldValue },
        { $set: { role: newValue } }
      ).exec();
    }
  }

  private async migrateUserStatus(valueMapping: Map<string, string>): Promise<void> {
    for (const [oldValue, newValue] of valueMapping) {
      const isActive = newValue === 'ACTIVE';
      await this.userModel.updateMany(
        { isActive: oldValue === 'ACTIVE' },
        { $set: { isActive } }
      ).exec();
    }
  }

  private async migrateOrganizationStatus(valueMapping: Map<string, string>): Promise<void> {
    for (const [oldValue, newValue] of valueMapping) {
      const isActive = newValue === 'ACTIVE';
      const result = await this.organizationModel.updateMany(
        { isActive: oldValue === 'ACTIVE' },
        { $set: { isActive } }
      ).exec();
      console.log(`Updated ${result.modifiedCount} organizations with status ${oldValue} → ${newValue}`);
    }
  }

  /**
   * Debug method to check which apps are using old enum values
   */
  async debugEnumUsage(key: string): Promise<any> {
    switch (key) {
      case 'APP_STATUS':
        const statusCounts = await this.appModel.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]).exec();
        return { key, counts: statusCounts };
      
      case 'APP_VISIBILITY':
        const visibilityCounts = await this.appModel.aggregate([
          { $group: { _id: '$visibility', count: { $sum: 1 } } }
        ]).exec();
        return { key, counts: visibilityCounts };
      
      case 'APP_PLATFORM':
        const platformCounts = await this.appModel.aggregate([
          { $unwind: '$platforms' },
          { $group: { _id: '$platforms', count: { $sum: 1 } } }
        ]).exec();
        return { key, counts: platformCounts };
      
      default:
        return { key, message: 'No debug info available for this enum type' };
    }
  }
}
